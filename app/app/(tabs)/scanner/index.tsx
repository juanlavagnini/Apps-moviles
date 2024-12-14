import { StyleSheet, Text, View, Pressable, Button, useColorScheme } from 'react-native'
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import React, { useEffect, useState } from 'react'
import { router, useFocusEffect } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '@/constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useScanContext } from './_layout';
import { useRefreshContext } from '../_layout';
import { Audio } from 'expo-av';

const scanner = () => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  //producto escaneado
  const {scan, setScan} = useScanContext();
  const {refresh, setRefresh} = useRefreshContext();

  //Cuando apretamos la cruz de exit en el scanner, se desactiva la camara
  const [isCameraActive, setIsCameraActive] = useState<boolean>(true);

  const [sound, setSound] = useState<Audio.Sound | null>(null);

  // Precargar el sonido al montar el componente
  useEffect(() => {
    let soundObject: Audio.Sound;

    const loadSound = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require('@/assets/sounds/beep.mp3'), // Ruta del archivo de sonido
        { shouldPlay: false } // Precargar pero no reproducir
      );
      soundObject = sound;
      setSound(soundObject);
    };

    loadSound();

    return () => {
      if (soundObject) {
        soundObject.unloadAsync(); // Liberar recursos al desmontar
      }
    };
  }, []);

  const playBeep = async () => {
    if (sound) {
      await sound.replayAsync(); // Reproducir el sonido inmediatamente
    }
  };



  //Lo ponemos en true para que se active la camara cuando volvemos a la pantalla
  useFocusEffect(() => {
    setIsCameraActive(true);
  });

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
  // ----------------------------------------------------------

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  
  return (
    <SafeAreaView style={styles.container}>
      {isCameraActive && (<CameraView 
        style={styles.camera} 
        facing={facing} 
        onBarcodeScanned={(result) => {
              setScan(true);
              if (scan) return;
              playBeep();
              router.push({
                pathname: '/scanner/modal_scanner_product',
                params: { product: result.data },
              });
            }} 
        >
        <View style={styles.buttonContainer}>
          {!scan &&
          (<Pressable style={styles.closeButton} 
            onPress={() => {
              router.push({pathname: '/pantry'});
              setRefresh(!refresh);
              setIsCameraActive(false);
              }} >
            <Ionicons name="close-circle" size={50} color="white" />
          </Pressable>)}
        </View>
        <View style={styles.flipButtonContainer}>
          <Pressable style={styles.facingButton} onPress={toggleCameraFacing}>
              <Ionicons name="camera-reverse" size={50} color="white" />
          </Pressable>
        </View> 
      </CameraView>)}
     
          
    </SafeAreaView>
  )
}

export default scanner

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

  camera: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 1,
    width: '100%',
  },

  //boton cancelar
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  closeButton: {
    margin: 10,
  },
  image: {
    width: 50,
    height: 50,
  },
  // ----------------
  //botones flip camera
  flipButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: "center",
    width: '100%',
    marginBottom: 35,
  },
  facingButton: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },

  buttonText: {
    color: 'white',
    fontSize: 16,
    justifyContent: 'center',
    textAlign: 'center',
  }
})