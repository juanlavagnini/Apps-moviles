import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  StatusBar,
  Pressable,
  FlatList,
  useColorScheme,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useUserContext } from '@/app/_layout';
import { useRefreshContext } from '../_layout';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, { useAnimatedStyle} from 'react-native-reanimated';

const Pantry = () => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

  const { user } = useUserContext();
  const URL = process.env.EXPO_PUBLIC_SERVER_URL;
  const [DATA, setDATA] = useState<any>([]);
  const { refresh, setRefresh } = useRefreshContext();

  const handleSwipeRight = (id: string, swipeableRef: any) => {
    console.log('Delete product', id);
    fetch(`${URL}/houseProduct/deleteProduct`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        houseId: user?.houseId,
        productId: id,
      }),
    }).then(() => {
      setRefresh(!refresh);
      swipeableRef.current?.close(); // Cierra el Swipeable después de la acción
    });
  };

  const handleSwipeLeft = (id: string, name: string, brand:string, swipeableRef: any) => {
    fetch(`${URL}/houseProduct/addProduct`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        houseId: user?.houseId,
        productId: id,
        name: name,
        brand: brand,
        quantity: 1,
      }),
    }).then(() => {
      console.log('Add product', id);
      setRefresh(!refresh);
      swipeableRef.current?.close(); // Cierra el Swipeable después de la acción
    });
  };

  const Item = ({ id, title, brand, quantity }: { id: string; title: string; brand: string; quantity: number }) => {
    const swipeableRef = useRef(null); // Referencia para controlar el Swipeable

    return (
      <Swipeable
        containerStyle={styles.swipeable}
        ref={swipeableRef} // Asigna la referencia
        renderRightActions={() => (
          <Pressable onPress={() => handleSwipeRight(id, swipeableRef)}>
            <View style={styles.actionContainerRight}>
              <Ionicons name="trash" size={30} color="white" />
            </View>
          </Pressable>
        )}
        renderLeftActions={() => (
          <Pressable onPress={() => handleSwipeLeft(id, title, brand, swipeableRef)}>
            <View style={styles.actionContainerLeft}>
              <Ionicons name="add" size={30} color="white" />
            </View>
          </Pressable>
        )}
        leftThreshold={10}
        rightThreshold={10}
        overshootLeft={false}
        overshootRight={false}
      
      >
        <View style={[styles.item, { backgroundColor: theme.lightOrange, flexDirection:"row", justifyContent: "space-between"}]}>
          <View>
            <Text style={[styles.title, { color: 'black' }]} numberOfLines={1} ellipsizeMode='tail'>{title}</Text>
            <Text style={{ color: 'black' }}>{quantity}</Text>
          </View>
          <Pressable style={[styles.editButton,{backgroundColor: theme.lightOrange,
                borderBottomColor: theme.darkOrange,}]} onPress={()=> router.push({
                  pathname: '/pantry/modal_product',
                  params: { productId: id },
                })}>
            <Ionicons name="create-outline" size={30} color="black" />
          </Pressable>
          </View>
      </Swipeable>
    );
  };

  useEffect(() => {
    console.log('Fetching pantry products');
    fetch(`${URL}/houseProduct/products/${user?.houseId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const DATA = data.map((item: { productId: number; name: string; brand: string ;quantity: number }) => {
          return { id: item.productId, title: item.name, brand: item.brand ,quantity: item.quantity };
        });
        setDATA(DATA);
      })
      .catch((error: any) => {
        console.error('ErrorPantry:', error);
      });
  }, [refresh, user?.houseId]);

  return (
    <GestureHandlerRootView>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <FlatList
          refreshControl={
                  <RefreshControl
                refreshing={false}
                onRefresh={() => {
                  setRefresh(!refresh);
                }}
                colors={[theme.contrast]}
                  />}
          style={{ height: '100%' }}
          data={DATA}
          renderItem={({ item }) => (
            <Item title={item.title} quantity={item.quantity} id={item.id} brand={item.brand} />
          )}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={<Text style = {styles.textEmpty}>Your Pantry is empty! Go to the scanner to add new products</Text>}
          ListFooterComponent={
            <View>
              <Pressable
                style={styles.pastproducts}
                onPress={() => router.push('/pantry/pastProducts')}
              >
                <Text style={{ color: theme.grey }}>See past products</Text>
              </Pressable>
              <View style={{ height: 50 }} />
            </View>
          }
        />
      </View>
    </GestureHandlerRootView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 5,
  },
  item: {
    borderRadius: 10,
    padding: 10,
    //marginHorizontal: 16,
    width: '100%',
    flex: 1,
    
  },
  title: {
    fontSize: 24,
    paddingRight: 40,
  },
  editButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    position: 'absolute',
    right: 0,
    borderRadius: 10,
    
  },
  pastproducts: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightAction: { width: 50, height: 50, backgroundColor: 'purple' },

  swipeable: {
    marginHorizontal:16,
    height: 'auto',
    width: 'auto',
  },
  actionContainerRight: {
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    padding: 15,
    backgroundColor: "red", 
    justifyContent: 'center', 
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },

  actionContainerLeft: {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    padding: 15,
    backgroundColor: "green", 
    justifyContent: 'center', 
    alignItems: 'center',
    height: '100%',
    width: '100%',
   },

  actionText: { 
    color: 'white',
    fontWeight: 'bold'
  },
  separator: {
    width: '100%',
    height: 10,
  },
  textEmpty: {
    textAlign: 'center',
    fontSize: 20,
    marginTop: 5,
  }
});

export default Pantry;