import { useUserContext } from '@/app/_layout';
import Logbutton from '@/components/Logbutton';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, {useRef, useState} from 'react';
import {Modal, StyleSheet, Pressable, View, TextInput, Text, useColorScheme} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import CustomGrid  from '@/components/customGrid';

const modal_edit_profile = () => {
  const URL = process.env.EXPO_PUBLIC_SERVER_URL;

  const { user, setUser } = useUserContext();

  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;
  const [nombre, setNombre] = useState(user?.name)
  const [apellido, setApellido] = useState(user?.surname)
  const [correo, setCorreo] = useState(user?.email)
  const [contrasena, setContrasena] = useState("")
  const [oldPassword, setOldPassword] = useState("")
  const [changePassword, setChangePassword] = useState(false)
  const [changeAvatar, setChangeAvatar] = useState(false)

  const [secureTextEntry, setSecureTextEntry] = useState(true);
  
  const togglePasswordVisibility = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const [isOwner, setIsOwner] = useState(false)

  //validations
  const [isIncorrect, setIsIncorrect] = useState(false)
  const [errorMessages, setErrorMessages] = useState({
    oldPassword: '',
    password: '',
    other: '',
  });

  const apellidoInputRef = useRef<TextInput>(null);
  const correoInputRef = useRef<TextInput>(null);
  const contrasenaInputRef = useRef<TextInput>(null);

  const handleEditwithoutPassword = () => {
    fetch(`${URL}/user/${user?.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: nombre,
        surname: apellido,
        email: correo,
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

  const handleEditPassword = () => {
    fetch(`${URL}/user/changepassword/${user?.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        oldPassword: oldPassword,
        password: contrasena,
      }),
    })
    .then(async response => {
      console.log(response);
      if (response.ok) {
        setChangePassword(false);
        setErrorMessages({
          oldPassword: '',
          password: '',
          other: '',
        });
      }else if (response.status === 400) {
          const data = await response.json();
          const errors = data.errors || [];
        const newErrorMessages = {
          oldPassword: '',
          password: '',
          other: '',
        };

        // Asignamos el error específico a cada campo
        errors.forEach((e: { field: string; message: string }) => {
          if (e.field === 'oldPassword') newErrorMessages.oldPassword = e.message;
          if (e.field === 'password') newErrorMessages.password = e.message;

        });
        setErrorMessages(newErrorMessages);
        setIsIncorrect(true);
        } else {
          setErrorMessages({
            oldPassword: '',
            password: '',
            other: 'An unexpected error occurred. Please try again later.',
          });
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
            <View style={styles.buttonContainer}>
              <Pressable style={styles.closeButton} 
                  onPress={() => {
                    router.back();
                    }} >
                  <Ionicons name="close-circle" size={40} color="black"/>
              </Pressable>
            </View>
            {changePassword ? (
              <View style={{width:"100%", justifyContent:"center", alignItems:"center"}}>
                <View style={styles.password_conteiner}>
                {Object.values(errorMessages).some((msg) => msg) && <Text style={styles.errorMessage}>
                {Object.values(errorMessages).join('\n')}</Text>}
                <TextInput 
                  placeholder='Old Password'
                  value={oldPassword} 
                  secureTextEntry={secureTextEntry}
                  onChangeText={setOldPassword}
                  style={[errorMessages.oldPassword ? styles.inputIncorrect : styles.input, { color: "black" }]}
                  placeholderTextColor="#666"
                  returnKeyType='next'
                  onSubmitEditing={() => contrasenaInputRef.current?.focus()}
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
                <View style={styles.password_conteiner}>
                <TextInput 
                  ref={contrasenaInputRef}
                  secureTextEntry={secureTextEntry}
                  placeholder='New Password'
                  value={contrasena} 
                  onChangeText={setContrasena}
                  style={[errorMessages.password ? styles.inputIncorrect : styles.input, { color: "black" }]}
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
              <Logbutton onPress={() => setChangePassword(false)} title={'Cancel'} light={true}>
              </Logbutton>
              <Logbutton onPress={() => { handleEditPassword();}} title={'Save password'}>
              </Logbutton>
              </View>
              ) : changeAvatar ? (
                <View style={{width:"100%", justifyContent:"center", alignItems:"center"}}>
                  <CustomGrid></CustomGrid>
                  <Logbutton onPress={() => { setChangeAvatar(false);}} title={'Save'}>
                  </Logbutton>
                </View>
              )
              :(
              <View style={{width:"100%", justifyContent:"center", alignItems:"center"}}>
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
                <Pressable onPress={() => setChangeAvatar(true)}>
                    <Text style={[styles.signUpText, {color: "black"}]}>Edit avatar</Text>
                </Pressable>
                <Pressable onPress={() => setChangePassword(true)}>
                    <Text style={[styles.signUpText, {color: "black"}]}>Change Password</Text>
                </Pressable>
                <View style={{flexDirection: "row", gap:10}}>
                  <Logbutton onPress={() => router.back()} title={'Cancel'} light={true}>
                  </Logbutton>
                  <Logbutton onPress={() => { handleEditwithoutPassword();}} title={'Save'}>
                  </Logbutton>
                </View>
              </View>
              )}
              

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
  buttonContainer: {
    flex: 1,
    backgroundColor: 'white',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  closeButton: {
    margin: -15,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius:100,

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
  signUpText: {
    fontSize: 16,
    textDecorationLine: 'underline',
    marginBottom: 20,
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
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    position: 'absolute',
    right: 10,
    bottom: 30,
  },
  errorMessage: {
    color: 'red',
    marginBottom: 20,
  },
});

export default modal_edit_profile;