import React, { useEffect, useState } from 'react';
import { SafeAreaView, View,  FlatList,  StyleSheet,  Text,  StatusBar,  PanResponder,  Animated, Easing, Pressable,} from 'react-native';
import { useRefreshContext, useScanContext, useUserContext } from '../_layout';
import { router } from 'expo-router';


const Pantry = () => {

  type ItemProps = {title: string, quantity: number};

  const { user } = useUserContext();
  const { scan } = useScanContext();
  const ip = process.env.EXPO_PUBLIC_IP;
  const [DATA, setDATA] = useState<any>([]);
  const { refresh, setRefresh } = useRefreshContext();
  const [isSwiping, setIsSwiping] = useState(false); 

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
    return;
  }

  const Item = ({ id, title, quantity }: { id: string; title: string; quantity: number }) => {
    const pan = new Animated.ValueXY();

    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setIsSwiping(true); // Bloquea el scroll al iniciar el gesto
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x }], { useNativeDriver: false }),
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 50) {
          handleSwipeRight(id);
        } else if (gestureState.dx < -50) {
          handleSwipeLeft(id);
        }
        // Reset position
        Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start(() => {
          setIsSwiping(false);}); //desbloquea el scroll al finalizar la animación
      },
    });

    return (
      <Animated.View style={[styles.item, { transform: [{ translateX: pan.x }] }]} {...panResponder.panHandlers}>
        <Text style={styles.title}>{title}</Text>
        <Text>Quantity: {quantity}</Text>
        <Pressable style={styles.editButton} onPress={()=> router.push({
                pathname: '/modal_product',
                params: { productId: id },
              })}>
          <Text>Edit Alert</Text>
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
  }, [scan, refresh]); //aca agregue la flag refresh

  console.log(DATA);
  return (
    <View style={styles.container}>
      <FlatList 
        data={DATA}
        renderItem={({item}) => <Item title={item.title} quantity={item.quantity} id={item.id}/>}
        keyExtractor={item => item.id}
        scrollEnabled={!isSwiping} // Bloquea el scroll mientras se está realizando un gesto
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
    flex: 1,
  },
  title: {
    fontSize: 32,
  },
  editButton: {
    backgroundColor: '#f9c2ff',
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
});

export default Pantry;