import { StyleSheet, Text, View, Image, TextInput, Pressable, KeyboardAvoidingView, ScrollView, Platform } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Colors } from '@/constants/Colors'
import { router } from 'expo-router'
import { useUserContext } from './_layout';
import Logbutton from '@/components/Logbutton';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';

const profile = () => {

  const URL = process.env.EXPO_PUBLIC_SERVER_URL;
  const [isIncorrect, setIsIncorrect] = useState(false)
  const [isOwner, setIsOwner] = useState(false)
  const { setUser } = useUserContext();

  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const togglePasswordVisibility = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const passwordInputRef = useRef<TextInput>(null);

  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

  const device = Platform.OS === 'ios' ? true : false;


  useEffect(() => {
    const checkToken = async () => {
      const token = await SecureStore.getItem('userToken');
      if (token) {
        // Aquí puedes validar el token si tienes un endpoint de verificación
        fetch(`${URL}/user/validatetoken`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
      })
      .then((response: Response) => response.json())
      .then((data: any) => {
        setUser({
          id: data.id,
          email: data.email,
          name: data.name,
          surname: data.surname,
          houseId: data.houseId,
          owner: data.ownedHouse,
        });
  
        router.push({ pathname: '/(tabs)' }); // Redirigir al inicio
      });
      };
    }
    checkToken();
  }, []);
 

  const signInHandler = async (email: string, password: string) => {
    try {
      console.log(URL)
      const response = await fetch(`${URL}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log(data);
      if (!data.user){
        setIsIncorrect(true); // Mostrar error si las credenciales son incorrectas
        return;
      }

      // Guardar el token JWT en AsyncStorage
      await SecureStore.setItem('userToken', data.token);

      // Guardar la información del usuario en el contexto
      setUser({
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        surname: data.user.surname,
        houseId: data.user.houseId,
        owner: data.user.ownedHouse,
      });

      router.push({ pathname: '/(tabs)' }); // Redirigir al inicio
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
 
  return (
    <>
    {device ? (
    <KeyboardAvoidingView style={styles.keyboardAvoidingView} behavior="padding">
    <View style={[styles.container]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Image source={require('@/assets/images/logo_app.jpeg')} style={styles.logo} />
          <Text style={[styles.title, {color: theme.grey}]}>Welcome!</Text>
          <Text style={[styles.subtitle,{color: theme.grey}]}>Log in to the account</Text>
          <TextInput 
            placeholder='Email' 
            value={email} 
            onChangeText={setEmail}
            returnKeyType='next'
            onSubmitEditing={() => passwordInputRef.current?.focus()}
            style={[isIncorrect? styles.inputIncorrect: styles.input, {color: theme.text}]}
            placeholderTextColor="#666"
          />
          <View style={styles.password_conteiner}>
            <TextInput 
              ref={passwordInputRef}
              secureTextEntry={secureTextEntry}
              placeholder='Password' 
              value={password} 
              onChangeText={setPassword}
              style={[isIncorrect? styles.inputIncorrect: styles.input, {color: theme.text}]}
              placeholderTextColor="#666"
              onSubmitEditing={() => signInHandler(email,password)}
              returnKeyType="done"
            />
            <Pressable
                style={styles.icon}
                onPress={togglePasswordVisibility}
              >
                <Ionicons
                  name={secureTextEntry ? 'eye-off' : 'eye'}
                  size={24}
                  color="gray"
                />
            </Pressable>
          </View>
          <Logbutton title="Log In" onPress={() => signInHandler(email,password)} />
          <View style={styles.signUpContainer}>
            <Text style={[styles.subtitle,{color: theme.grey}]} >Don't have an account? </Text>
            <Pressable onPress={() => (router.push({pathname: "/signup"}))}>
              <Text style={[styles.signUpText, {color: theme.darkOrange}]}>Sign up here</Text>
            </Pressable>
          </View>  
      </ScrollView>
    </View> 
    </KeyboardAvoidingView>)
    : (
      <View style={[styles.container]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Image source={require('@/assets/images/logo_app.jpeg')} style={styles.logo} />
          <Text style={[styles.title, {color: theme.grey}]}>Welcome!</Text>
          <Text style={[styles.subtitle,{color: theme.grey}]}>Log in to the account</Text>
          <TextInput 
            placeholder='Email' 
            value={email} 
            onChangeText={setEmail}
            returnKeyType='next'
            onSubmitEditing={() => passwordInputRef.current?.focus()}
            style={[isIncorrect? styles.inputIncorrect: styles.input, {color: theme.text}]}
            placeholderTextColor="#666"
          />
          <View style={styles.password_conteiner}>
            <TextInput 
              ref={passwordInputRef}
              secureTextEntry={secureTextEntry}
              placeholder='Password' 
              value={password} 
              onChangeText={setPassword}
              style={[isIncorrect? styles.inputIncorrect: styles.input, {color: theme.text}]}
              placeholderTextColor="#666"
              onSubmitEditing={() => signInHandler(email,password)}
              returnKeyType="done"
            />
            <Pressable
                style={styles.icon}
                onPress={togglePasswordVisibility}
              >
                <Ionicons
                  name={secureTextEntry ? 'eye-off' : 'eye'}
                  size={24}
                  color="gray"
                />
            </Pressable>
          </View>
          <Logbutton title="Log In" onPress={() => signInHandler(email,password)} />
          <View style={styles.signUpContainer}>
            <Text style={[styles.subtitle,{color: theme.grey}]} >Don't have an account? </Text>
            <Pressable onPress={() => (router.push({pathname: "/signup"}))}>
              <Text style={[styles.signUpText, {color: theme.darkOrange}]}>Sign up here</Text>
            </Pressable>
          </View>  
      </ScrollView>
    </View> 
    )}
    </>
  )
}

export default profile

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,  
    margin: 20,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
    width:"100%",
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
    width: '100%',
    height: 50,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  inputIncorrect: {
    width: '100%',
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
  password_conteiner: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    position: 'absolute',
    right: 10,
    bottom: 30,
  },
})