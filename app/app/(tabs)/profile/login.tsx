import { StyleSheet, Text, View, Image, TextInput, Pressable } from 'react-native'
import React, { useState } from 'react'
import { Colors } from '@/constants/Colors'
import { router } from 'expo-router'


const profile = () => {

  const [isIncorrect, setIsIncorrect] = useState(false)

  const signInHandler = (email: string, password: string) => {
    fetch('http://192.168.1.43:3000/user/login', {
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
    .then(response => (response.ok? router.push({pathname: "/profile/user"}): setIsIncorrect(true)))
  }
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
 
  

  return (
    <View style={styles.container}>
      <Text style={{fontSize:50, marginVertical:25}}>Login</Text>
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
      <Pressable onPress={() => (router.push({pathname: "/profile/signup"}))}>
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