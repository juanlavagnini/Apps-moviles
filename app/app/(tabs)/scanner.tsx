import { StyleSheet, Text, View, Pressable, TouchableOpacity, Button, Image } from 'react-native'
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import React, { useState } from 'react'
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const scanner = () => {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }
  return (
    <SafeAreaView style={styles.container}>
      <CameraView style={styles.camera} facing={facing}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.facingButton} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
      <Pressable style={styles.closeButton} onPress={() => router.push({pathname: '/pantry'})}>
        <Image source={require('../../assets/images/close.png')} style={{ width: 30, height: 30 }} />
      </Pressable>
      <View style={styles.functionButtonContainer}>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Insert</Text>
        </Pressable>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Delete</Text>
        </Pressable>
      </View>

      
    </SafeAreaView>
  )
}

export default scanner

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  button: {
    backgroundColor: '#9C4196',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    width: '50%',
    height: 50,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 10,
  },
  closeButton: {
    padding: 10,
    borderRadius: 50,
    width: 40,
    height: 80,
    alignItems: 'center',
    position: 'absolute',
    justifyContent: 'center',
    top: 30,
    left: 10,
  },
  facingButton: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  functionButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 50,
    padding: 20,
    bottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    justifyContent: 'center',
    textAlign: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
})