import React, { useEffect, useRef, useState } from 'react';
import { View,FlatList,StyleSheet,Text,StatusBar,SectionList, useColorScheme } from 'react-native';
import { useUserContext } from '../_layout';
import { Colors } from '@/constants/Colors';
import { useRefreshContext } from './_layout';



const List = () => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

  const { user } = useUserContext();
  const { refresh } = useRefreshContext();
  const URL = process.env.EXPO_PUBLIC_SERVER_URL;
  const sectionListRef = useRef<SectionList<any>>(null);
  const [DATA, setDATA] = useState<any>([]);

  // Función para desplazarse a la sección
  const scrollToSection = (index: any) => {
    sectionListRef.current?.scrollToLocation({
      sectionIndex: index,
      itemIndex: 0, // Puedes ajustar esto si necesitas que se enfoque un elemento específico
    });
  };

  type ItemProps = {title: string, brand: string, quantityToBuy: number};

  const Item = ({title, brand, quantityToBuy}: ItemProps) => (
    <View style={[styles.item, {backgroundColor: theme.lightOrange,
      borderBottomColor: theme.darkOrange,
      borderLeftColor: theme.darkOrange, shadowColor:theme.shadowColor}]}>
      <View style={styles.item_container}>
        <View>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          <Text>{brand}</Text>
        </View>
        <Text style={styles.quantity}>{quantityToBuy}</Text>
      </View>
    </View>
  );

  useEffect(() => {
    fetch(`${URL}/houseProduct/supermarketList/${user?.houseId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const DATA = data.map((item: { productId: number; name: string, brand: string, quantityToBuy: number }) => {
          return { id: item.productId, title: item.name, brand: item.brand, quantityToBuy: item.quantityToBuy };
        });
        setDATA(DATA);
      })
      .catch((error: any) => {
        console.error('ErrorPantry:', error);
      });
  }, [refresh]);

  return (
    <View style={[styles.container, {backgroundColor: theme.background}]}>
      <FlatList
        data={DATA}
        renderItem={({item}) => <Item title={item.title} brand={item.brand} quantityToBuy={item.quantityToBuy} />}
        keyExtractor={item => item.id}
        ListFooterComponent={<View style={{height: 50}} />}
        ListEmptyComponent={<Text style = {styles.textEmpty}>It is not necessary to go to the supermarket!</Text>}
      />
    </View>
  );
};

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
  },
  item_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantity: {
    fontSize: 20,
    padding: 10,
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 10,
  },

  title: {
    fontSize: 24,
  },

  categoryList: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  textEmpty: {
    textAlign: 'center',
    fontSize: 20,
    marginTop: 5,
  }

});

export default List;
