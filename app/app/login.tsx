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
      <Text style={styles.title}>Welcome Back!</Text>
      <Text style={styles.subtitle}>Log in to the account</Text>
      <TextInput placeholder='Email' value={email} onChangeText={setEmail}
        style={isIncorrect? styles.inputIncorrect: styles.input}
        placeholderTextColor="#666"
      />
      <TextInput placeholder='Password' value={password} onChangeText={setPassword}
        style={isIncorrect? styles.inputIncorrect: styles.input}
        placeholderTextColor="#666"
      />
      <Pressable style={styles.button} onPress={() => signInHandler(email,password)}>
        <Text style={styles.buttonText}>Log In</Text>
      </Pressable>
      <View style={styles.signUpContainer}>
        <Text style={styles.newAccountText} >Don't have an account? </Text>
        <Pressable onPress={() => (router.push({pathname: "/signup"}))}>
          <Text style={styles.signUpText} >Sign up here</Text>
        </Pressable>
      </View>  
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
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: "#000",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,

  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    height: 50,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  inputIncorrect: {
    width: '80%',
    height: 50,
    borderBottomWidth: 1,
    borderColor: "red",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,

  },
  button: {
    width: '20%',
    height: 40,
    backgroundColor: "#673ab7",
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: 'bold',
  },
  signUpText: {
    color: "#673ab7",
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  newAccountText: {
    color: "#666",
    fontSize: 16,
  },
  signUpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
})