import { Button, StyleSheet, Text, View } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect } from 'react'
import QRCode from 'react-native-qrcode-svg';
import { useUserContext } from '@/app/_layout';
import { router } from 'expo-router';
import {Modal, Pressable, TextInput} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';

const invite_qr = () => {

    const { user, setUser } = useUserContext();
    const [permission, requestPermission] = useCameraPermissions();
    const [scan, setScan] = React.useState<boolean>(false);
    const ip = process.env.EXPO_PUBLIC_IP
    
    useEffect(() => {
        if (!permission) requestPermission();
      }, [permission]);
      
      //Permisos de la camara
      // ------------------------------------------------------------
      if (!permission) {
        // Camera permissions are still loading.
        return <View />;
      }
    
      if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
          <View style={styles.container}>
            <Text style={styles.message}>We need your permission to show the camera</Text>
            <Button onPress={requestPermission} title="Grant permission" />
          </View>
        );
      }
    if (!user?.owner) {
        router.push('/profile');
    }


    const handleJoinHouse = (ownerEmail: string) => {
        console.log(ownerEmail);
        fetch(`http://${ip}:3000/house/join`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: user?.id,
                ownerEmail: ownerEmail,
            }),
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            setUser({
              id: user?.id || 0,
              email: user?.email || '',
              name: user?.name || '',
              surname: user?.surname || '',
              houseId: data.ownedHouse.id,
              owner: false,
            });
            router.back();
        })
        
    }   

    return (
        <SafeAreaProvider>
        <SafeAreaView style={styles.centeredView}>
          <Modal animationType="slide"
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
                        <Ionicons name="close-circle" size={40} color="black" />
                    </Pressable>
                </View>
                <CameraView style={{height: 200, width: 200}} 
                    onBarcodeScanned={(result) => {
                        setScan(true);
                        if (scan) return;
                        handleJoinHouse(result.data);
                    }} />


              </View>
            </View>
          </Modal>
        </SafeAreaView>
        </SafeAreaProvider>
  )
}

export default invite_qr

const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        backgroundColor: 'black',
    },
    message: {
        justifyContent: 'center',
        textAlign: 'center',
        paddingBottom: 10,
    },
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
      heading: {
        fontSize: 25,
        marginBottom: 10,
      },
      text: {
        fontSize: 16,
        marginBottom: 10,
      },
      buttonContainer: {
        flex: 1,
        backgroundColor: 'white',
        position: 'absolute',
        top: 0,
        left: 0,
      },
      buttons: {
        flexDirection: 'row', 
        gap: 10,
      },
      closeButton: {
        margin: -15,
      },
})