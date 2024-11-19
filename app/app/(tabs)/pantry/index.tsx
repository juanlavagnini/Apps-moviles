import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  StatusBar,
  Pressable,
  FlatList,
  useColorScheme,
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
  const ip = process.env.EXPO_PUBLIC_IP;
  const [DATA, setDATA] = useState<any>([]);
  const { refresh, setRefresh } = useRefreshContext();
  const [isSwiping, setIsSwiping] = useState(false);

  const handleSwipeLeft = (id: string, swipeableRef: any) => {
    console.log('Delete product', id);
    fetch(`http://${ip}:3000/houseProduct/deleteProduct`, {
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

  const handleSwipeRight = (id: string, swipeableRef: any) => {
    fetch(`http://${ip}:3000/houseProduct/addProduct`, {
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

  const Item = ({ id, title, quantity }: { id: string; title: string; quantity: number }) => {
    const swipeableRef = useRef(null); // Referencia para controlar el Swipeable

    return (
      <Swipeable
        ref={swipeableRef} // Asigna la referencia
        renderLeftActions={() => (
          <Pressable onPress={() => handleSwipeRight(id, swipeableRef)}>
            <View style={styles.actionContainerRight}>
              <Text style={styles.actionText}>Add</Text>
            </View>
          </Pressable>
        )}
        renderRightActions={() => (
          <Pressable onPress={() => handleSwipeLeft(id, swipeableRef)}>
            <View style={styles.actionContainerLeft}>
              <Text style={styles.actionText}>Delete</Text>
            </View>
          </Pressable>
        )}
      >
        <View style={[styles.item, { backgroundColor: theme.lightOrange, flexDirection:"row", justifyContent: "space-between"}]}>
          <View>
            <Text style={[styles.title, { color: 'black' }]}>{title}</Text>
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
    fetch(`http://${ip}:3000/houseProduct/products/${user?.houseId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const DATA = data.map((item: { productId: number; name: string; quantity: number }) => {
          return { id: item.productId, title: item.name, quantity: item.quantity };
        });
        setDATA(DATA);
      })
      .catch((error: any) => {
        console.error('ErrorPantry:', error);
      });
  }, [refresh]);

  return (
    <GestureHandlerRootView>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <FlatList
          style={{ height: '100%' }}
          data={DATA}
          renderItem={({ item }) => (
            <Item title={item.title} quantity={item.quantity} id={item.id} />
          )}
          keyExtractor={(item) => item.id}
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
    paddingRight: 40,
  },
  editButton: {
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  pastproducts: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightAction: { width: 50, height: 50, backgroundColor: 'purple' },
  separator: {
    width: '100%',
    borderTopWidth: 1,
  },
  swipeable: {
    height: 50,
    backgroundColor: 'papayawhip',
    alignItems: 'center',
  },
  actionContainerRight: {borderRadius: 10,
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,backgroundColor: "red", justifyContent: 'center', alignItems: 'center', width: 75, height: '100%' },
  actionContainerLeft: {borderRadius: 10,
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,backgroundColor: "green", justifyContent: 'center', alignItems: 'center', width: 75, height: '100%' },
  actionText: { color: 'white', fontWeight: 'bold' },
});

export default Pantry;