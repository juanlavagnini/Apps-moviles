import { Pressable, StyleSheet, Text, View, FlatList, useColorScheme, StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useUserContext } from '@/app/_layout';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useRefreshContext } from '../_layout';


const pastProducts = () => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

  const { user } = useUserContext();
  const URL = process.env.EXPO_PUBLIC_SERVER_URL;
  const [DATA, setDATA] = useState<any>([]);
  const { refresh, setRefresh } = useRefreshContext();

  const handleRestoreProduct = (id: string) => {
      fetch(`${URL}/houseProduct/addProduct`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          houseId: user?.houseId,
          productId: id,
        }),
      })
      setRefresh(!refresh);
  }


  const Item = ({ id, title, quantity }: { id: string; title: string; quantity: number }) => {
      return (
        <View style={[styles.item, {backgroundColor: theme.lightOrange,
          borderBottomColor: theme.darkOrange,
          borderLeftColor: theme.darkOrange, shadowColor: theme.shadowColor}]}>
          <Text style={styles.title}>{title}</Text>
          <Text>Quantity: {quantity}</Text>
          <Pressable style={[styles.editButton, {backgroundColor: theme.lightOrange,
    borderBottomColor: theme.darkOrange,}]} onPress={()=> handleRestoreProduct(id)}>
            <Ionicons name="add" size={40} color="#666"/>
          </Pressable>
        </View>
      );    
  };

  useEffect(() => {
      fetch(`${URL}/houseProduct/pastProducts/${user?.houseId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          const DATA = data.map((item: { productId: number; name: string, quantity: number }) => {
            return { id: item.productId, title: item.name, quantity: item.quantity };
          });
          setDATA(DATA);
        })
        .catch((error: any) => {
          console.error('ErrorPantry:', error);
        });
    }, [refresh]);
  
  return (
    <View style={[styles.container, {backgroundColor: theme.background,}]}>
    <FlatList 
        data={DATA}
        renderItem={({item}) => <Item title={item.title} quantity={item.quantity} id={item.id}/>}
        keyExtractor={item => item.id}
    />
    </View>
  )
}

export default pastProducts

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //marginTop: StatusBar.currentHeight || 0,
    paddingTop: StatusBar.currentHeight,
  },
  item: {
    borderRadius: 10,
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    flex: 1,
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
    shadowOffset: { width: 0, height: 2.5 },
  },
  title: {
    fontSize: 24,
    paddingRight: 40,
  },
  editButton: {
    borderRadius: 10,
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
})