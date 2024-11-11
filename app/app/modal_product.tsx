import React, { useEffect, useState } from 'react';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useScanContext, useUserContext } from './_layout';
import user from './(tabs)/profile/user';
import { Ionicons } from '@expo/vector-icons';

export default function Modal() {
  const ip = process.env.EXPO_PUBLIC_IP
  const { user } = useUserContext();
  const { productId = "" } = useLocalSearchParams();
  const [productData, setProductData] = useState<any>(null);
  const [DBData, setDBData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (productId) {
      fetch(`https://world.openfoodfacts.org/api/v0/product/${productId}.json`)
        .then((response) => response.json())
        .then((data) => {
          setProductData(data);
          setLoading(false);
        })
        .catch((error) => {
          setError(error.message);
          setLoading(false);
        });
      
        fetch(`http://${ip}:3000/houseProduct/product/${user?.houseId}/${productId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((response) => response.json())
        .then((data) => {
          setDBData(data);
        })
        .catch((error) => {
          setError(error.message);
          setLoading(false);
        })
    }
  }, [productId]);
  console.log(productData);
  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Pressable style={styles.closeButton} 
            onPress={() => {
              router.back();
              }} >
            <Ionicons name="close-circle" size={50} color="black" />
        </Pressable>
      </View>
      {loading && <Text>Loading...</Text>}
      {productData && productData.status == 1 && productData.product.product_name != "" ? (
        <View>
          <Text>Product Name: {productData.product.product_name}</Text>
          <Text>Brand: {productData.product.brands}</Text>
          <Text>Ingredients: {productData.product.ingredients_text}</Text>
        </View>
      ) : null}
      {productData && productData.status == 0 ? (
        <View>
          <Text>Product Name: {DBData.name}</Text>
        </View>
      ) : null}
      <View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 60,
    marginVertical: 200,
    backgroundColor: '#fff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  closeButton: {
    margin: 10,
  },
  image: {
    width: 50,
    height: 50,
  },
  addButton: {
    flex: 1,
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});