import React, { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, SafeAreaView, StyleSheet, Text, TextInput, View, Modal } from 'react-native';
import { useUserContext } from '@/app/_layout';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';
import { useScanContext } from './_layout';

export default function scanner_modal() {
  const { product = "" } = useLocalSearchParams();
  const { setScan } = useScanContext();
  const { user } = useUserContext();
  const [productData, setProductData] = useState<any>(null);
  const [DBdata, setDBdata] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [manualName, setManualName] = useState<string>("");
  const [brand, setBrand] = useState<string>("");

  const ip = process.env.EXPO_PUBLIC_IP

  //Primero checkeamos si el producto ya existe en la base de datos de este usuario
  useEffect(() => {
    fetch(`http://${ip}:3000/houseProduct/product/${user?.houseId}/${product}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data) {
          setLoading(false);
          setDBdata(data);
        }
      })
      .catch((error) => {
        setError(error.message);
        //setLoading(false);
      });
  }, [product]);  

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
    const productBrand = (productData.status == 1) ? productData.product.brands : brand;

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
        brand: productBrand,
      }),
    })
    setScan(false);
    router.back();
  };

  //Si el producto ya existe en la base de datos de este usuario, se muestra
  //Si no se lo busca en la API
  //Si no se encuentra, se muestra un input para agregarlo manualmente
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.centeredView}>
        <Modal animationType="slide"
          transparent={true}
          onRequestClose={() => {
            setScan(false);
            router.back();
          }}>
        <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.heading}>Product</Text>
          <Text style={styles.text}>Product ID: {product}</Text>
          {loading && (
                <LottieView
                  source={require('@/assets/loading.json')}
                  autoPlay
                  loop
                  style={{ width: 100, height: 100 }}
                />
              )}
          {error && <Text>Error: {error}</Text>}

          {DBdata ? (
          <View style={styles.textContainer}>
            <Text style={styles.text} numberOfLines={1}>Product Name: {DBdata.name}</Text>
            <Text style={styles.text} numberOfLines={1}>Brand: {DBdata.brand}</Text>
          </View>
          ) : productData && productData.status == 1 && productData.product.product_name != "" ? (
          <View style={styles.textContainer}>
            <Text style={styles.text} numberOfLines={1}>Product Name: {productData.product.product_name}</Text>
            <Text style={styles.text} numberOfLines={1}>Brand: {productData.product.brands}</Text>
          </View>
          ) : productData && productData.status == 0 ?(
          <View>
            <Text style={styles.notFoundText}>Product not found</Text>    
            <TextInput
              style={styles.input}
              onChangeText={(text: string) => setManualName(text)}
              value={manualName}
              placeholder="Enter product name"
              placeholderTextColor={'#666'}
            />
            <TextInput
              style={styles.input}
              onChangeText={(text: string) => setBrand(text)}
              value={brand}
              placeholder="Enter brand"
              placeholderTextColor={'#666'}
            />
          </View>
          ): null }


          {!loading ? <View style={styles.buttonContainer}>
          <Pressable
            style={styles.closeButton}
            onPress={() => {
              setScan(false);
              router.back();
            }}>
              <Text style={styles.buttonText}>Cancel</Text>
          </Pressable>
          <Pressable 
            style={styles.addButton}
            onPress={handleAddProduct(product, productData)}>
              <Text style={styles.buttonText}>Add</Text>
          </Pressable>
          </View> : null}
          </View>
        </View>
        </Modal> 
      </SafeAreaView>
    </SafeAreaProvider>
    
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '70%',
    margin: 10,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  textContainer: {
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 25,
    marginBottom: 25,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
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
  input: {
    width: '100%',
    height: 50,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 5,
  },
  notFoundText: {
    fontSize: 16,
    marginBottom: 10,
    marginTop: 10,
    color: 'red',
    alignSelf: 'center',
  },
});