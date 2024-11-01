import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  StatusBar,
} from 'react-native';
import { useScanContext, useUserContext } from '../_layout';


type ItemProps = {title: string, quantity: number};

const Item = ({title, quantity}: ItemProps) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
    <Text>Quantity: {quantity}</Text>
  </View>
);

const Pantry = () => {

  const { user } = useUserContext();
  const { scan } = useScanContext();
  const ip = process.env.EXPO_PUBLIC_IP;
  const [DATA, setDATA] = useState<any>([]);



  useEffect(() => {
    fetch(`http://${ip}:3000/houseProduct/products/${user?.houseId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        const DATA = data.map((item: { id: string; name: string, quantity: number }) => {
          return { id: item.id, title: item.name, quantity: item.quantity };
        });
        setDATA(DATA);
      })
      .catch((error: any) => {
        console.error('ErrorPantry:', error);
      });
  }, [scan]);

  console.log(DATA);
  return (
    <View style={styles.container}>
      <FlatList 
        data={DATA}
        renderItem={({item}) => <Item title={item.title} quantity={item.quantity} />}
        keyExtractor={item => item.id}
        ListFooterComponent={<View style={{height: 50}} />}
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
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});

export default Pantry;