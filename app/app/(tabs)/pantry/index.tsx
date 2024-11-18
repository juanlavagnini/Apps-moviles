import React, { useEffect, useState } from 'react';
import { View,  FlatList,  StyleSheet,  Text,  StatusBar,  PanResponder,  Animated, Pressable, useColorScheme,} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useUserContext } from '@/app/_layout';
import { useRefreshContext } from '../_layout';

const Pantry = () => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

  
  type ItemProps = {title: string, quantity: number};

  const { user } = useUserContext();
  const ip = process.env.EXPO_PUBLIC_IP;
  const [DATA, setDATA] = useState<any>([]);
  const { refresh, setRefresh } = useRefreshContext();

  //Quiero agregar gestos de swipe para eliminar (izquierda) o agregar (derecha) productos
  //https://reactnative.dev/docs/flatlist#onswipableleft

  const handleSwipeLeft = (id: string) => {
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
    });
   setRefresh(!refresh); //es una flag para que se actualice la lista
  }

  const handleSwipeRight = (id: string) => {
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
    const pan = React.useRef(new Animated.ValueXY()).current;
    const [gestureLocked, setGestureLocked] = React.useState<'swipe' | 'scroll' | null>(null);
  
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 2 || Math.abs(gestureState.dy) > 2;
      },
      onMoveShouldSetPanResponder: (_, gestureState) => {
        //if (gestureLocked) return gestureLocked === 'swipe'; // Mantener el tipo de gesto decidido.
        const { dx, dy } = gestureState;
  
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 5) {
          setGestureLocked('swipe'); // Bloquear en swipe.
          return true;
        } else if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 5) {
          setGestureLocked('scroll'); // Bloquear en scroll.
          return false; // Dejar el control al scroll.
        }
        return false;
      },

      onPanResponderGrant: () => {
        if (gestureLocked === 'swipe') {
          pan.extractOffset(); // Configura la posición inicial para el swipe.
        }
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureLocked === 'swipe') {
          Animated.event([null, { dx: pan.x }], { useNativeDriver: false })(_, gestureState);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureLocked === 'swipe') {
          if (gestureState.dx > 50) {
            console.log('swipe right');
            handleSwipeRight(id);
          } else if (gestureState.dx < -50) {
            console.log('swipe left');
            handleSwipeLeft(id);
          }
          // Resetear posición con animación.
          Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
        }
        setGestureLocked(null); // Liberar el bloqueo.
      },
      onPanResponderTerminate: () => {
        // Reseteo si el gesto es cancelado.
        Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
        setGestureLocked(null);
        console.log('onPanResponderTerminate');
      },
    });
    return (
      <Animated.View style={[styles.item, {backgroundColor: theme.lightOrange,
        borderBottomColor: theme.darkOrange,
        borderLeftColor: theme.darkOrange, shadowColor: theme.shadowColor},{ transform: [{ translateX: pan.x }] }]} {...panResponder.panHandlers}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Text>Quantity: {quantity}</Text>
        <Pressable style={[styles.editButton,{backgroundColor: theme.lightOrange,
    borderBottomColor: theme.darkOrange,}]} onPress={()=> router.push({
                pathname: '/pantry/modal_product',
                params: { productId: id },
              })}>
          <Ionicons name="create-outline" size={30} color="black" />
        </Pressable>
      </Animated.View>

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
        const DATA = data.map((item: { productId: number; name: string, quantity: number }) => {
          return { id: item.productId, title: item.name, quantity: item.quantity };
        });
        setDATA(DATA);
      })
      .catch((error: any) => {
        console.error('ErrorPantry:', error);
      });
  }, [refresh]); //aca agregue la flag refresh

  return (
    <View style={[styles.container,{backgroundColor: theme.background}]}>
      <FlatList 
        style={{height: '100%'}}
        data={DATA}
        renderItem={({item}) => <Item title={item.title} quantity={item.quantity} id={item.id}/>}
        keyExtractor={item => item.id}

        ListFooterComponent={
        <View>
          <Pressable style={styles.pastproducts} onPress={()=> router.push("/pantry/pastProducts")}>
            <Text style={{color: theme.grey}}>See past products</Text>
          </Pressable>
          <View style={{height: 50}} />
        </View>
      }
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
  pastproducts: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Pantry;