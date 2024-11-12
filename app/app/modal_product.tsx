import React, { useEffect, useState } from 'react';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useRefreshContext, useScanContext, useUserContext } from './_layout';
import user from './(tabs)/profile/user';
import { Ionicons } from '@expo/vector-icons';

export default function Modal() {
  const ip = process.env.EXPO_PUBLIC_IP
  const { user } = useUserContext();
  const { refresh, setRefresh } = useRefreshContext();
  const { productId = "" } = useLocalSearchParams();
  const [DBData, setDBData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showInputAlert, setshowInputAlert] = useState<Boolean>(false);
  const [minQuantity, setMinQuantity] = useState<number>(0);

  useEffect(() => {
    if (productId) {
      fetch(`http://${ip}:3000/houseProduct/product/${user?.houseId}/${productId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => response.json())
      .then((data) => {
        setDBData(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      })
    }
  }, []);

  console.log(DBData);


  function handleNewalert(min: number) {
    fetch(`http://${ip}:3000/houseProduct/updateAlert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        houseId: user?.houseId,
        productId: productId,
        minimum: min
      }),
    })
    .then((response) => response.json())
    .then((data) => {
      setDBData(data);
      setRefresh(!refresh);
    })
    .catch((error) => {
      setError(error.message);
    })
  }

  function handleRemoveAlert() {
    fetch(`http://${ip}:3000/houseProduct/removeAlert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        houseId: user?.houseId,
        productId: productId,
      }),
    })
    .then((response) => response.json())
    .then((data) => {
      setDBData(data);
      setRefresh(!refresh);
    })
    .catch((error) => {
      setError(error.message);
    })
  }


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
      {DBData && (
      <View>
        <Text>Name: {DBData.name}</Text>
        <Text>Brand: {DBData.brand}</Text>
        <Text>Stored quantity: {DBData.quantity}</Text>

        <View style={{ borderBottomColor: 'grey',
                        borderBottomWidth: 1,
                        marginVertical: 10,}}/>
        {DBData.hasAlert ? showInputAlert ? 
          (<View>
            <TextInput 
              placeholder='Minimum Quantity' 
              style={styles.input} 
              placeholderTextColor="#666"
              onChange={(e) => setMinQuantity(Number(e.nativeEvent.text))}/> 
              <Pressable style={styles.updateButton} onPress={() => {
              handleNewalert(minQuantity)
              setshowInputAlert(false)
              }
              }>
                <Text>Update Alert</Text>
              </Pressable>
          </View> ) : 
        (
          <View style={{gap:5}}>
            <Text>Has alert set for: {DBData.minimum}</Text>
            <Pressable style={styles.updateButton} onPress={()=> setshowInputAlert(true)}>
              <Text>Update Alert</Text>
            </Pressable>
            <Pressable style={styles.removeButton} onPress={() => handleRemoveAlert()}>
              <Text>Remove Alert</Text>
            </Pressable>
          </View>
        ) : 
        (<View>
          <TextInput 
            placeholder='Minimum Quantity' 
            style={styles.input} 
            placeholderTextColor="#666"
            onChange={(e) => setMinQuantity(Number(e.nativeEvent.text))}/> 
            <Pressable style={styles.addButton} onPress={() => handleNewalert(minQuantity)}>
              <Text>Set Alert</Text>
            </Pressable>
        </View> )}         
      </View>
      )}
      
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
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  updateButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButton: {
    backgroundColor: 'red',
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
    paddingHorizontal: 10,
    marginBottom: 10,},
});