import { StyleSheet, Text, View, Image, TextInput, Pressable } from 'react-native'
import React, { useState } from 'react'
import { Colors } from '@/constants/Colors'
import { router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage';


const profile = () => {

  const ip = process.env.EXPO_PUBLIC_IP
  const [isIncorrect, setIsIncorrect] = useState(false)

  const signInHandler = (email: string, password: string) => {
    console.log(`http://${ip}:3000/user/login`)
    fetch(`http://${ip}:3000/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password
      }),
    })
    //si es true, redirigir a la pagina de inicio, false cambio el color de los recuadros
    .then(response => {
      if (!response.ok) {
        setIsIncorrect(true); // Manejar error si la respuesta no es OK
        return null; // Asegurarse de no procesar más
      }
      return response.json(); // Convertir a JSON si es exitoso
    })
    .then(async data => {
      if (data) {
        const id = data.id;
        const jsonValue = JSON.stringify(id);
        try {
          await AsyncStorage.setItem('id', jsonValue);
        }
        catch (error) {
          console.error('Error:', error);
        }
        router.push({ pathname: "/(tabs)"
         });
      }
    })
    
    .catch(error => {
      console.error('Error:', error); // Manejar errores de red
    });
  }
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
 
  return (
    <View style={styles.container}>
      <Text style={{fontSize:50}}>Login</Text>
      <Text>Email</Text>
      <TextInput value={email} onChangeText={setEmail}
        style={isIncorrect? styles.inputIncorrect: styles.input}
      />
      <Text>Password</Text>
      <TextInput value={password} onChangeText={setPassword}
        style={isIncorrect? styles.inputIncorrect: styles.input}
      />
      <Pressable style={styles.button} onPress={() => signInHandler(email,password)}>
        <Text>Sign in</Text>
      </Pressable>
      <Pressable onPress={() => (router.push({pathname: "/signup"}))}>
        <Text style={styles.buttonText} >Create an account</Text>
      </Pressable>
    </View> 
  )
}

export default profile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    marginTop: 50,
    justifyContent: "center",
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

  text: {
    fontSize: 20,
    fontWeight: 'bold',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '60%',
    height: 40,
    borderWidth: 3,
  },
  inputIncorrect: {
    width: '60%',
    height: 40,
    borderWidth: 3,
    borderColor: "red"
  },
  button: {
    marginTop: 20,
    width: '60%',
    height: 40,
    backgroundColor: Colors.dark.icon,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    width: '60%',
    color: Colors.light.buttonWithBackground,
    justifyContent: 'center',
    alignItems: 'center',
  }
})