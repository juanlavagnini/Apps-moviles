import { GestureResponderEvent, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { TabBarIcon } from './navigation/TabBarIcon'
import { Ionicons } from '@expo/vector-icons'
import { tintColor, Colors } from '@/constants/Colors'

const TabBarButtom = ({onPress, onLongPress, isFocused, routeName, color, label}: {onPress: (event: GestureResponderEvent) => void, onLongPress: (event: GestureResponderEvent) => void, isFocused: boolean, routeName: string, color: string, label:any}) => {  
    return (
    <Pressable
        onPress={onPress}
        onLongPress={onLongPress}
        style={styles.tabBarIcon}
        >
        <Ionicons name={'barcode-outline'} size={50} color={color} />
    </Pressable>
  )
}

export default TabBarButtom

const styles = StyleSheet.create({
    tabBarIcon: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,
        backgroundColor: tintColor,
        padding: 5,  //20
        paddingVertical: 17,  //30
        borderRadius: 100,  //20
        position: 'relative',
        top: -10, //-30
        shadowOpacity: 0.6,
        aspectRatio: 1,
      }
})