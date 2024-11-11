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
  const [DBData, setDBData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
    fetch(`http://${ip}:3000/houseProduct/setAlert`, {
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
        {DBData.hasAlert ? (
          <View style={{gap:5}}>
            <Text>Has alert set for: {DBData.minimum}</Text>
            <Pressable style={styles.updateButton}>
              <Text>Update Alert</Text>
            </Pressable>
            <Pressable style={styles.removeButton}>
              <Text>Remove Alert</Text>
            </Pressable>
          </View>
        ) : (
          <View style={{gap:5}}>
            <Text>No alert set</Text>
            <Pressable style={styles.addButton} onPress={handleNewalert()}>
              <Text>Add Alert</Text>
            </Pressable>
          </View>
        )}
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
  }
});