import { StyleSheet, Text, View, Image, TextInput, Pressable, KeyboardAvoidingView, ScrollView, Platform } from 'react-native'
import React, { useRef, useState } from 'react'
import { Colors } from '@/constants/Colors'
import { router, useNavigationContainerRef } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUserContext } from './_layout';
import Logbutton from '@/components/Logbutton';
import { useColorScheme } from 'react-native';

const profile = () => {

  const ip = process.env.EXPO_PUBLIC_IP
  const [isIncorrect, setIsIncorrect] = useState(false)
  const [isOwner, setIsOwner] = useState(false)
  const { setUser } = useUserContext();

  const passwordInputRef = useRef<TextInput>(null);

  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

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
      //return response.json(); // Convertir a JSON si es exitoso
      const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return response.json(); // Convertir a JSON si es exitoso
        } else {
          throw new Error('Received non-JSON response');
        }
    })
    .then(async data => {
      if (data) {
        console.log(data)
        const id = data.id;
        const email = data.email;
        const houseId = data.houseId;
        const owner = data.ownedHouse;
        if (data.ownedHouse==null){
          setIsOwner(false);
        }
        else{
          setIsOwner(true);
        }
        try {
          setUser({id, email, houseId, owner});
        }
        catch (error) {
          console.error('ErrorLogin:', error);
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
    <KeyboardAvoidingView 
        style={[styles.keyboardAvoidingView,{ backgroundColor: theme.background }]} 
        behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={[styles.container]}>
            <Image source={require('@/assets/images/logo_app.jpeg')} style={styles.logo} />
            <Text style={[styles.title, {color: theme.text}]}>Welcome Back!</Text>
            <Text style={[styles.subtitle,{color: theme.subTitle}]}>Log in to the account</Text>
            <TextInput 
              placeholder='Email' 
              value={email} 
              onChangeText={setEmail}
              returnKeyType='next'
              onSubmitEditing={() => passwordInputRef.current?.focus()}
              style={[isIncorrect? styles.inputIncorrect: styles.input, {color: theme.text}]}
              placeholderTextColor="#666"
            />
            <TextInput 
              ref={passwordInputRef}
              placeholder='Password' 
              value={password} 
              onChangeText={setPassword}
              style={isIncorrect? styles.inputIncorrect: styles.input}
              placeholderTextColor="#666"
              onSubmitEditing={() => signInHandler(email,password)}
              returnKeyType="done"
            />
            <Logbutton title="Log In" onPress={() => signInHandler(email,password)} />
            <View style={styles.signUpContainer}>
              <Text style={[styles.subtitle,{color: theme.subTitle}]} >Don't have an account? </Text>
              <Pressable onPress={() => (router.push({pathname: "/signup"}))}>
                <Text style={[styles.signUpText, {color: theme.tint}]}>Sign up here</Text>
              </Pressable>
            </View>  
          </View> 
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default profile

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    justifyContent: "center",
    gap: 20,  
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,  
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 100,
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
  signUpText: {
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  signUpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
})