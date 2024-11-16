import React, { useEffect, useRef, useState } from 'react';
import { View,FlatList,StyleSheet,Text,StatusBar,SectionList, useColorScheme } from 'react-native';
import { useRefreshContext, useUserContext } from '../_layout';
import { Colors } from '@/constants/Colors';



const List = () => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

  const { user } = useUserContext();
  const { refresh, setRefresh } = useRefreshContext();
  const ip = process.env.EXPO_PUBLIC_IP;
  const sectionListRef = useRef<SectionList<any>>(null);
  const [DATA, setDATA] = useState<any>([]);

  // Función para desplazarse a la sección
  const scrollToSection = (index: any) => {
    sectionListRef.current?.scrollToLocation({
      sectionIndex: index,
      itemIndex: 0, // Puedes ajustar esto si necesitas que se enfoque un elemento específico
    });
  };

  type ItemProps = {title: string, brand: string};

  const Item = ({title, brand}: ItemProps) => (
    <View style={[styles.item, {backgroundColor: theme.lightOrange,
      borderBottomColor: theme.darkOrange,
      borderLeftColor: theme.darkOrange, shadowColor:theme.shadowColor}]}>
      <Text style={styles.title} numberOfLines={1}>{title}</Text>
      <Text>{brand}</Text>
    </View>
  );

  useEffect(() => {
    fetch(`http://${ip}:3000/houseProduct/supermarketList/${user?.houseId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const DATA = data.map((item: { productId: number; name: string, brand: string }) => {
          return { id: item.productId, title: item.name, brand: item.brand };
        });
        setDATA(DATA);
        console.log('DATA:', DATA);
      })
      .catch((error: any) => {
        console.error('ErrorPantry:', error);
      });
  }, [refresh]);

  return (
    <View style={[styles.container, {backgroundColor: theme.background}]}>
      <FlatList
        data={DATA}
        renderItem={({item}) => <Item title={item.title} brand={item.brand} />}
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
    marginTop: StatusBar.currentHeight || 0,
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
