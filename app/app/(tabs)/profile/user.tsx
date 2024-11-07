import { StyleSheet, Text, View, Image, TextInput, Pressable } from 'react-native'
import React, { useState } from 'react'
import { Colors } from '@/constants/Colors'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUserContext } from '@/app/_layout';
import QRCode from 'react-native-qrcode-svg';
import { router } from 'expo-router';
import Logbutton from '@/components/Logbutton';


const user = () => {
  const { user, setUser } = useUserContext();


  const handleLogout = () => {
    setUser(null);
    router.navigate({ pathname: '/login' });
  }

  return (
    //El comportamiento deberia ser el siguiente:
    //Si el usuario es propietario de una casa, se le muestra el QR de su casa (a travez de un presable)
    //Si el usuario no es propietario de una casa, se le muestra un boton para unirse a una casa
    //Por defecto siempre es propietario de una casa, asi que deberia tener un boton para unirse a otra casa
    //Realmente deberia tener algun tipo de seguridad el QR para que solo se pueda unir a la casa si se escanea el QR
      <View style={styles.container}>
          <Image source={{uri: 'https://reactnative.dev/img/tiny_logo.png'}} style={styles.image}/>
          <Text>Email {user?.email}</Text>
          <Text>Your House ID is: {user?.houseId}</Text>
          <Text>Owner: {user?.owner ? 'Yes' : 'No'}</Text>
          {
          user?.owner ? <QRCode value={user?.houseId.toString()} size={200} /> : 
                        <Pressable onPress={() => {}}><Text>Join another house</Text></Pressable>
          }
          <Logbutton onPress={handleLogout} title="Logout" />
      </View>
  )
}

export default user

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    marginTop: 50,
    alignItems: "center",
    gap: 20,  
  },
  image: {
    width: 200,
    height: 200,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 100,
  },
})