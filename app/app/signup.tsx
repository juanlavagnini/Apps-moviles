import { StyleSheet, Text, View, Image, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState } from 'react'
import { Colors } from '@/constants/Colors'


const profile = () => {
  const ip = process.env.EXPO_PUBLIC_IP

  const signUpHandler = (nombre:string, apellido:string, correo:string, contrasena:string) => {
    
    fetch(`http://${ip}:3000/user/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: nombre,
        surname: apellido,
        email: correo,
        password: contrasena
      }),
    })
  }
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  

  return (
    /*<View style={styles.container}>
      <Image source={{uri: 'https://reactnative.dev/img/tiny_logo.png'}} style={styles.image}/>
      <Text style={styles.text}>Trini</Text>
    </View>*/
    <KeyboardAvoidingView 
          style={styles.keyboardAvoidingView} 
          behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
            <Text style={styles.title}>Create an account</Text>
            <TextInput placeholder='Name' value={nombre} onChangeText={setNombre}
              style={styles.input}
              placeholderTextColor="#666"
            />
            <TextInput placeholder='Lastname' value={apellido} onChangeText={setApellido}
              style={styles.input}
              placeholderTextColor="#666"
            />
            <TextInput placeholder='Email' value={correo} onChangeText={setCorreo}
              style={styles.input}
              placeholderTextColor="#666"
            />
            <TextInput placeholder='Password' value={contrasena} onChangeText={setContrasena}
              style={styles.input}
              placeholderTextColor="#666"
              returnKeyType='done'
              onSubmitEditing={() => signUpHandler(nombre, apellido, correo, contrasena)}
            />
            <Pressable style={styles.button} onPress={() => signUpHandler(nombre, apellido, correo, contrasena)}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </Pressable>
          </View>
        </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default profile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,  
  },
  scrollContainer: {
    flex: 1,
    margin: 10,
    justifyContent: "center",
    gap: 20,  
  },
  keyboardAvoidingView: {
    flex: 1,
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
  button: {
    width: '25%',
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
})