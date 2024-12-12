import { StyleSheet, Text, View, Pressable, ScrollView,useColorScheme } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors'
import { useUserContext } from '@/app/_layout';
import { router } from 'expo-router';
import Logbutton from '@/components/Logbutton';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { icons } from '@/constants/Avatars';
import { useAvatarContext } from './_layout';


const index = () => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;
  
  const { user, setUser } = useUserContext();
  const ip = process.env.EXPO_PUBLIC_IP;

  const { selected, setSelected } = useAvatarContext();


  const handleLogout = async () => {
    setUser(null);
    await SecureStore.deleteItemAsync('userToken');
    router.navigate({ pathname: '/login' });
  }

  const handleLeave = async () => { 
    console.log('Leaving house');
    fetch(`http://${ip}:3000/house/leave`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user?.id,
        houseId: user?.houseId,
      }),
    })
    .then((response: Response) => response.json())
    .then((data: any) => {
      console.log(data);
      setUser({
        id: data.id,
        email: data.email,
        name: data.name,
        surname: data.surname,
        houseId: data.houseId,
        owner: data.ownedHouse,
      });
    });
  }

  return (
    //El comportamiento deberia ser el siguiente:
    //Si el usuario es propietario de una casa, se le muestra el QR de su casa (a travez de un presable)
    //Si el usuario no es propietario de una casa, se le muestra un boton para unirse a una casa
    //Por defecto siempre es propietario de una casa, asi que deberia tener un boton para unirse a otra casa
    //Realmente deberia tener algun tipo de seguridad el QR para que solo se pueda unir a la casa si se escanea el QR
    /*{
          user?.owner ? <QRCode value={user?.houseId.toString()} size={200} /> : 
                        <Pressable onPress={() => {}}><Text>Join another house</Text></Pressable>
      }*/
      <ScrollView style={[styles.scrollContainer, {backgroundColor: theme.background }]}>
      <View style={[styles.container, {backgroundColor: theme.background}]}>
          <View>
            <Ionicons name={icons[selected]} size={110} style={[styles.avatar, {backgroundColor: theme.grey}]} />
            <Pressable hitSlop={5} style={[styles.edit, {backgroundColor: theme.contrast, borderColor: theme.background}]}
            onPress={() => router.push('/profile/modal_edit_profile')}>
              <Ionicons name="pencil" size={20} color={theme.grey}/>
            </Pressable>
          </View>
          <Text style={{fontSize: 30,color: theme.grey}}>Hi, {user?.name}!</Text>
          <Text style={{color: theme.grey}}>Your House ID is: {user?.houseId}</Text>
          <Text style={{color: theme.grey}}>Owner: {user?.owner ? 'Yes' : 'No'}</Text>
          {
            user?.owner ? (
              <View style={styles.buttonContainer}>
                <Logbutton onPress={() => router.push('/profile/invite_qr')} title="Invite members"/>
                <Logbutton onPress={() => router.push('/profile/join_house')} title="Join another house" />
                <Logbutton onPress={() => router.push('/profile/leave_house')} title="Leave House"/>
              </View>
            ) : (
              <View style={styles.buttonContainer}>
                <Logbutton onPress={() => router.push('/profile/invite_qr')} title="Invite members"/>
                <Logbutton onPress={() => router.push('/profile/join_house')} title="Join another house" />
                <Logbutton onPress={() => router.push('/profile/leave_house')}title="Leave House"/>
              </View>
            )
          }
          
          <Logbutton onPress={handleLogout} title="Logout" />
      </View>
      </ScrollView>
  )
}

export default index

const styles = StyleSheet.create({
  scrollContainer: {
    height: '100%',
    flex: 1,
    gap: 20,  
  },
  container: {
    width: '100%',
    flex: 1,
    padding: 10,
    alignItems: "center",
    gap: 20,  
  },
  avatar: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 100,
    color:"white",
    padding: 20,
  },
  edit:{
    position: "absolute",
    right: 0,
    bottom: 0,
    borderRadius: 110,
    padding: 5,
    borderWidth: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 10,
    margin: 10,
  },
})