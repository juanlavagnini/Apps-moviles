import React, { useEffect, useState } from 'react';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useScanContext, useUserContext } from './_layout';
import user from './(tabs)/profile/user';

export default function Modal() {
  const { product = "" } = useLocalSearchParams();
  const { setScan } = useScanContext();
  const { user } = useUserContext();
  const [productData, setProductData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [manualName, setManualName] = useState<String>("");

  const ip = process.env.EXPO_PUBLIC_IP

  useEffect(() => {
    if (product) {
      fetch(`https://world.openfoodfacts.org/api/v0/product/${product}.json`)
        .then((response) => response.json())
        .then((data) => {
          setProductData(data);
          setLoading(false);
        })
        .catch((error) => {
          setError(error.message);
          setLoading(false);
        });
    }
  }, [product]);

  const handleAddProduct = (productId: string | string [], productData: any) => () => {
    //Si la API no tiene nombre, se usa el nombre manual
    const name = (productData.status == 1) ? productData.product.product_name : manualName;

    console.log('Add product', productId);
    fetch(`http://${ip}:3000/houseProduct/addProduct`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        houseId: user?.houseId,
        productId: productId,
        name: name ,
      }),
    })
    setScan(false);
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text>Product</Text>
      <Text>{product}</Text>
      {loading && <Text>Loading...</Text>}
      {error && <Text>Error: {error}</Text>}
      {productData && productData.status == 1 && productData.product.product_name != "" ? (
        <View>
          <Text>Product Name: {productData.product.product_name}</Text>
          <Text>Brand: {productData.product.brands}</Text>
          <Text>Ingredients: {productData.product.ingredients_text}</Text>
        </View>
      ) : null}
      {productData && productData.status == 0 ?(
        <View>
          <Text>Product not found</Text>    
          <TextInput
            style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
            onChangeText={(text: string) => setManualName(text)}
          />
        </View>
      ): null }
      {!loading ? <View style={styles.buttonContainer}>
        <Pressable
          style={styles.closeButton}
          onPress={() => {
            setScan(false);
            router.back();
          }}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </Pressable>
        <Pressable 
          style={styles.addButton}
          onPress={handleAddProduct(product, productData)}
        >
          <Text style={styles.buttonText}>Add</Text>
        </Pressable>
      </View> : null}
      {/*<View style={styles.buttonContainer}>
        <Pressable
          style={styles.closeButton}
          onPress={() => {
            setScan(false);
            router.navigate({ pathname: '/scanner' });
          }}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </Pressable>
        <Pressable 
          style={styles.addButton}
          onPress={handleAddProduct(product, productData)}
        >
          <Text style={styles.buttonText}>Add</Text>
        </Pressable>
      </View>*/
      }
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
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 10,
    margin: 10,
  },
  closeButton: {
    flex: 1,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
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