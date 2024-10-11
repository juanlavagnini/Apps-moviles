/*<View style={styles.container}>
      <Image source={{uri: 'https://reactnative.dev/img/tiny_logo.png'}} style={styles.image}/>
      <Text style={styles.text}>Trini</Text>
    </View>*/
import { StyleSheet, Text, View, Image, TextInput, Pressable } from 'react-native'
import React, { useState } from 'react'
import { Colors } from '@/constants/Colors'
    
    
const user = () => {
    return (
        <View style={styles.container}>
            <Image source={{uri: 'https://reactnative.dev/img/tiny_logo.png'}} style={styles.image}/>
            <Text>Trini</Text>
        </View>
    )
}

export default user

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
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
})