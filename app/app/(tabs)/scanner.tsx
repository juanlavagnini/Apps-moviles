import { StyleSheet, Text, View, Pressable, TouchableOpacity, Button, Image } from 'react-native'
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import React, { useState } from 'react'
import { router } from 'expo-router';

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
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.facingButton} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
      <Pressable style={styles.closeButton} onPress={() => router.push({pathname: '/pantry'})}>
        <Text style={styles.closeButtonText}>X</Text>
      </Pressable>
      <Pressable style={styles.button}>
        <Text>Insert Product</Text>
      </Pressable>
      <Pressable style={styles.button}>
        <Text>Delete Product</Text>
      </Pressable>
      
    </View>
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
    width: '80%',
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 50,
    width: 30,
    height: 30,
    alignItems: 'center',
    position: 'absolute',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 17,
    alignContent: 'center',
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
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
})