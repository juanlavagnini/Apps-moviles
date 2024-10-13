import { StyleSheet, Text, View, Image, TextInput, Pressable } from 'react-native'
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
    <View style={styles.container}>
      <Text style={{fontSize:50}}>Registro</Text>
      <Text>Nombre</Text>
      <TextInput value={nombre} onChangeText={setNombre}
        style={styles.input}
      />
      <Text>Apellido</Text>
      <TextInput value={apellido} onChangeText={setApellido}
        style={styles.input}
      />
      <Text>Correo</Text>
      <TextInput value={correo} onChangeText={setCorreo}
        style={styles.input}
      />
      <Text>Contraseña</Text>
      <TextInput value={contrasena} onChangeText={setContrasena}
        style={styles.input}
      />
      <Pressable style={styles.button} onPress={() => signUpHandler(nombre, apellido, correo, contrasena)}>
        <Text>Registrarse</Text>
      </Pressable>

    </View>
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
  button: {
    marginTop: 20,
    width: '60%',
    height: 40,
    backgroundColor: Colors.dark.icon,
    justifyContent: 'center',
    alignItems: 'center',
  },
})