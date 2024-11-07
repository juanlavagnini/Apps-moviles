import { StyleSheet, Text, View, Image, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useRef, useState } from 'react'
import { Colors } from '@/constants/Colors'
import { useUserContext } from './_layout'
import { router } from 'expo-router'
import Logbutton from '@/components/Logbutton'


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
    .then(response => {
      if (response.ok) {
        router.push({ pathname: "/login" });
      }
    })
  }
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')

  const apellidoInputRef = useRef<TextInput>(null);
  const correoInputRef = useRef<TextInput>(null);
  const contrasenaInputRef = useRef<TextInput>(null);

  

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
            <TextInput 
              placeholder='Name' 
              value={nombre} 
              onChangeText={setNombre}
              returnKeyType="next"
              onSubmitEditing={() => apellidoInputRef.current?.focus()}
              style={styles.input}
              placeholderTextColor="#666"
            />
            <TextInput 
              ref={apellidoInputRef}
              placeholder='Lastname' 
              value={apellido} 
              onChangeText={setApellido}
              returnKeyType="next"
              onSubmitEditing={() => correoInputRef.current?.focus()}
              style={styles.input}
              placeholderTextColor="#666"
            />
            <TextInput 
              ref={correoInputRef}
              placeholder='Email' 
              value={correo} 
              onChangeText={setCorreo}
              returnKeyType="next"
              onSubmitEditing={() => contrasenaInputRef.current?.focus()}
              style={styles.input}
              placeholderTextColor="#666"
            />
            <TextInput 
              ref={contrasenaInputRef}
              placeholder='Password' 
              value={contrasena} 
              onChangeText={setContrasena}
              style={styles.input}
              placeholderTextColor="#666"
              returnKeyType='done'
              onSubmitEditing={() => signUpHandler(nombre, apellido, correo, contrasena)}
            />
            <Logbutton title="Sign Up" onPress={() => signUpHandler(nombre, apellido, correo, contrasena)} />
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
})