import { Pressable, StyleSheet, Text, View, FlatList, useColorScheme } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRefreshContext, useScanContext, useUserContext } from '@/app/_layout';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

const colorScheme = useColorScheme();
const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

const pastProducts = () => {
    const { user } = useUserContext();
    const { scan } = useScanContext();
    const ip = process.env.EXPO_PUBLIC_IP;
    const [DATA, setDATA] = useState<any>([]);
    const { refresh, setRefresh } = useRefreshContext();

    const handleRestoreProduct = (id: string) => {
        fetch(`http://${ip}:3000/houseProduct/addProduct`, {
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
          <View style={styles.item}>
            <Text style={styles.title}>{title}</Text>
            <Text>Quantity: {quantity}</Text>
            <Pressable style={styles.editButton} onPress={()=> handleRestoreProduct(id)}>
              <Ionicons name="add" size={40} color="#666"/>
            </Pressable>
          </View>
        );    
    };

    useEffect(() => {
        fetch(`http://${ip}:3000/houseProduct/pastProducts/${user?.houseId}`, {
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
      }, [scan, refresh]);
    
  return (
    <FlatList 
        data={DATA}
        renderItem={({item}) => <Item title={item.title} quantity={item.quantity} id={item.id}/>}
        keyExtractor={item => item.id}
    />
  )
}

export default pastProducts

const styles = StyleSheet.create({
  item: {
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: theme.tint,
  },
  title: {
    fontSize: 32,
  },
  editButton: {
    backgroundColor: theme.tint,
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
})