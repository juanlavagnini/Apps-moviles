import { StyleSheet, Text, View, Image, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform, useColorScheme } from 'react-native'
import React, { useRef, useState } from 'react'
import { Colors } from '@/constants/Colors'
import { router } from 'expo-router'
import Logbutton from '@/components/Logbutton'
import { Ionicons } from '@expo/vector-icons'


const profile = () => {
  const URL = process.env.EXPO_PUBLIC_SERVER_URL;

  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;
  const [isIncorrect, setIsIncorrect] = useState(false)
  const [errorMessages, setErrorMessages] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    contrasena: '',
  });

  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const togglePasswordVisibility = () => {
    setSecureTextEntry(!secureTextEntry);
  };


  const signUpHandler = (nombre:string, apellido:string, correo:string, contrasena:string) => {
    
    fetch(`${URL}/user/signup`, {
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
    .then(async response => {
      if (response.ok) {
        router.push({ pathname: "/login" });
        setErrorMessages({
          nombre: '',
          apellido: '',
          correo: '',
          contrasena: '',
        });
      }else if (response.status === 400) {
          const data = await response.json();
          const errors = data.errors || [];
        const newErrorMessages = {
          nombre: '',
          apellido: '',
          correo: '',
          contrasena: '',
        };

        // Asignamos el error específico a cada campo
        errors.forEach((e: { field: string; message: string }) => {
          if (e.field === 'name') newErrorMessages.nombre = e.message;
          if (e.field === 'surname') newErrorMessages.apellido = e.message;
          if (e.field === 'email') newErrorMessages.correo = e.message;
          if (e.field === 'password') newErrorMessages.contrasena = e.message;
        });
        setErrorMessages(newErrorMessages);
        setIsIncorrect(true);
        } else {
          setErrorMessages({
            nombre: 'An unexpected error occurred.',
            apellido: '',
            correo: '',
            contrasena: '',
          });
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
    <KeyboardAvoidingView 
          style={[styles.keyboardAvoidingView, { backgroundColor: theme.background }]} 
          behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
            <Text style={[styles.title, {color: theme.grey}]}>Create an account</Text>
            {Object.values(errorMessages).some((msg) => msg) && <Text style={styles.errorMessage}>{Object.values(errorMessages).join('\n')}</Text>}
            <TextInput 
              placeholder='Name' 
              value={nombre} 
              onChangeText={setNombre}
              returnKeyType="next"
              onSubmitEditing={() => apellidoInputRef.current?.focus()}
              style={[errorMessages.nombre ? styles.inputIncorrect : styles.input, { color: theme.text }]}
              placeholderTextColor="#666"
            />
            <TextInput 
              ref={apellidoInputRef}
              placeholder='Lastname' 
              value={apellido} 
              onChangeText={setApellido}
              returnKeyType="next"
              onSubmitEditing={() => correoInputRef.current?.focus()}
              style={[errorMessages.apellido ? styles.inputIncorrect : styles.input, { color: theme.text }]}
              placeholderTextColor="#666"
            />
            <TextInput 
              ref={correoInputRef}
              placeholder='Email' 
              value={correo} 
              onChangeText={setCorreo}
              returnKeyType="next"
              onSubmitEditing={() => contrasenaInputRef.current?.focus()}
              style={[errorMessages.correo ? styles.inputIncorrect : styles.input, { color: theme.text }]}
              placeholderTextColor="#666"
            />
            <View style={styles.password_conteiner}>
              <TextInput 
                secureTextEntry={secureTextEntry}
                ref={contrasenaInputRef}
                placeholder='Password' 
                value={contrasena} 
                onChangeText={setContrasena}
                style={[errorMessages.contrasena ? styles.inputIncorrect : styles.input, { color: theme.text }]}
                placeholderTextColor="#666"
                returnKeyType='done'
                onSubmitEditing={() => signUpHandler(nombre, apellido, correo, contrasena)}
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
    width: '80%',
    justifyContent: "center",
    alignItems: "center",
    gap: 20,  
  },
  scrollContainer: {
    flex: 1,
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
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
  errorMessage: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
    textAlign: "center",
  },
})