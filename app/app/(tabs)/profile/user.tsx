import { StyleSheet, Text, View, Image, TextInput, Pressable } from 'react-native'
import React, { useState } from 'react'
import { Colors } from '@/constants/Colors'
import AsyncStorage from '@react-native-async-storage/async-storage';


const user = () => {
  const [id, setId] = useState<string | null>(null);

  React.useEffect(() => {
    const fetchId = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('id');
        setId(jsonValue != null ? JSON.parse(jsonValue) : null);
      } catch (e) {
        console.error('Error:', e);
      }
    };

    fetchId();
  }, []);

  return (
      <View style={styles.container}>
          <Image source={{uri: 'https://reactnative.dev/img/tiny_logo.png'}} style={styles.image}/>
          <Text>{id}</Text>
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