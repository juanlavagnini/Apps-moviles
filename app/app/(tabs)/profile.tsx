import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'

const profile = () => {
  return (
    <View style={styles.container}>
      <Image source={{uri: 'https://reactnative.dev/img/tiny_logo.png'}} style={styles.image}/>
      <Text style={styles.text}>Trini</Text>
    </View>
  )
}

export default profile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
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
  }
})