import { useUserContext } from '@/app/_layout';
import Logbutton from '@/components/Logbutton';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, {useRef, useState} from 'react';
import {Modal, StyleSheet, Pressable, View, TextInput} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const modal_edit_profile = () => {
  const ip = process.env.EXPO_PUBLIC_IP

  const { user, setUser } = useUserContext();


  const [isIncorrect, setIsIncorrect] = useState(false)
  const [nombre, setNombre] = useState(user?.name)
  const [apellido, setApellido] = useState(user?.surname)
  const [correo, setCorreo] = useState(user?.email)
  const [contrasena, setContrasena] = useState("")

  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const togglePasswordVisibility = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const [isOwner, setIsOwner] = useState(false)

  const apellidoInputRef = useRef<TextInput>(null);
  const correoInputRef = useRef<TextInput>(null);
  const contrasenaInputRef = useRef<TextInput>(null);

  const handleEdit = () => {
    fetch(`http://${ip}:3000/user/${user?.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: nombre,
        surname: apellido,
        email: correo,
        password: contrasena,
      }),
    })
    .then(response => {
      if (!response.ok) {
        setIsIncorrect(true);
        return null;
      }
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return response.json();
      } else {
        throw new Error('Received non-JSON response');
      }
    })
    .then(async data => {
      if (data) {
        const id = data.id;
        const email = data.email;
        const name = data.name;
        const surname = data.surname;
        const houseId = data.houseId;
        const owner = data.ownedHouse;
        if (data.ownedHouse==null){
          setIsOwner(false);
        }
        else{
          setIsOwner(true);
        }
        try {
          setUser({id, email, name, surname, houseId, owner});
        }
        catch (error) {
          console.error('ErrorLogin:', error);
        }
    }})
    .catch((error) => {
      console.error('Error:', error);
    });
    router.back();
  }
  
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          onRequestClose={() => {
            router.back();
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TextInput 
                placeholder= {user?.name} 
                value={nombre} 
                onChangeText={setNombre}
                returnKeyType="next"
                onSubmitEditing={() => apellidoInputRef.current?.focus()}
                style={[styles.input, {color: "black"}]}
                placeholderTextColor= "#666"
              />
              <TextInput 
                ref={apellidoInputRef}
                placeholder= {user?.surname}  
                value={apellido} 
                onChangeText={setApellido}
                returnKeyType="next"
                onSubmitEditing={() => correoInputRef.current?.focus()}
                style={[styles.input, {color: "black"}]}
                placeholderTextColor="#666"
              />
              <TextInput 
                ref={correoInputRef}
                placeholder={user?.email}
                value={correo} 
                onChangeText={setCorreo}
                returnKeyType="next"
                onSubmitEditing={() => contrasenaInputRef.current?.focus()}
                style={[styles.input, {color: "black"}]}
                placeholderTextColor="#666"
              />
              <View style={styles.password_conteiner}>
                <TextInput 
                  ref={contrasenaInputRef}
                  secureTextEntry={secureTextEntry}
                  placeholder='New Password'
                  value={contrasena} 
                  onChangeText={setContrasena}
                  style={[styles.input, {color: "black"}]}
                  placeholderTextColor="#666"
                  returnKeyType='done'
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
              <Logbutton onPress={() => { handleEdit();}} title={'Save'}>
              </Logbutton>

            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '70%',
    margin: 10,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 15,
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
});

export default modal_edit_profile;