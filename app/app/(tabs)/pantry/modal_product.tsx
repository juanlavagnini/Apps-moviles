import React, { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput, View, Modal, SafeAreaView, useColorScheme } from 'react-native';
import { useUserContext } from '../../_layout';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { useRefreshContext } from '../_layout';

export default function product_modal() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;
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
    <SafeAreaProvider>
      <SafeAreaView style={styles.centeredView}>
        <Modal animationType="slide"
          transparent={true}
          onRequestClose={() => {
            router.back();
          }}>
          <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.buttonContainer}>
              <Pressable style={styles.closeButton} 
                  onPress={() => {
                    router.back();
                    }} >
                  <Ionicons name="close-circle" size={40} color="black" />
              </Pressable>
            </View>
            <View>
              <Text style={styles.heading} numberOfLines={1}>Product Information</Text>
            </View>
        {loading && <Text>Loading...</Text>}
        {DBData && (
        <View>
          <View style={{ borderBottomColor: 'grey',
                          borderBottomWidth: 1,
                          marginVertical: 10,
                          alignItems: 'center',}}>
            <Text style={styles.text}>{DBData.name}</Text>
            <Text style={styles.text}>Brand: {DBData.brand}</Text>
            <Text style={styles.text}>Stored quantity: {DBData.quantity}</Text>
          </View>
          {DBData.hasAlert ? showInputAlert ? 
            (<View>
              <TextInput 
                placeholder='Minimum Quantity' 
                style={styles.input} 
                placeholderTextColor="#666"
                onChange={(e) => setMinQuantity(Number(e.nativeEvent.text))}/> 
                <Pressable style={[styles.updateButton, {backgroundColor: theme.darkOrange}]} 
                            onPress={() => {
                              handleNewalert(minQuantity)
                              setshowInputAlert(false)}}>
                  <Text style={{color: theme.darkBrown}}>Update Alert</Text>
                </Pressable>
            </View> ) : 
          (
            <View style={{gap:5, alignItems: 'center'}}>
              <Text style={styles.text}>Has alert set for: {DBData.minimum}</Text>
              <View style={styles.buttons}>
                <Pressable style={[styles.updateButton, {backgroundColor: theme.darkOrange}]} onPress={()=> setshowInputAlert(true)}>
                  <Text style={{color: theme.darkBrown}}>Update Alert</Text>
                </Pressable>
                <Pressable style={[styles.removeButton, {backgroundColor: theme.darkOrange}]} onPress={() => handleRemoveAlert()}>
                  <Text style={{color: theme.darkBrown}}>Remove Alert</Text>
                </Pressable>
              </View>
            </View>
          ) : 
          (<View>
            <TextInput 
              placeholder='Minimum Quantity' 
              style={styles.input} 
              placeholderTextColor="#666"
              onChange={(e) => setMinQuantity(Number(e.nativeEvent.text))}/> 
              <Pressable style={[styles.addButton, {backgroundColor: theme.darkOrange}]} onPress={() => handleNewalert(minQuantity)}>
                <Text style={{color: theme.darkBrown}}>Set Alert</Text>
              </Pressable>
          </View> )}         
        </View>
        )}
        
        <View>
             </View>
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
  heading: {
    fontSize: 25,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'white',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  buttons: {
    flexDirection: 'row', 
    gap: 10,
  },
  closeButton: {
    margin: -15,
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