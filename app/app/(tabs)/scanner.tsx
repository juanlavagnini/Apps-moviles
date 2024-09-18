import { StyleSheet, Text, View, Pressable } from 'react-native'
import React from 'react'

const scanner = () => {
  return (
    <View style={styles.container}>
      <Text>scanner</Text>
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
  button: {
    backgroundColor: '#9C4196',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
  }
})