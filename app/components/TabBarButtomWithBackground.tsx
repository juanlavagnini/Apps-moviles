import { GestureResponderEvent, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { TabBarIcon } from './navigation/TabBarIcon'

const TabBarButtom = ({onPress, onLongPress, isFocused, routeName, color, label}: {onPress: (event: GestureResponderEvent) => void, onLongPress: (event: GestureResponderEvent) => void, isFocused: boolean, routeName: string, color: string, label:any}) => {  
    return (
    <Pressable
        onPress={onPress}
        onLongPress={onLongPress}
        style={styles.tabBarIcon}
        >
        <TabBarIcon name="scan" color={color} />
        <Text style={{ color: color}}>
            {label}
        </Text>
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
        backgroundColor: '#673ab7',
        padding: 20,
        paddingVertical:30,
        borderRadius: 20,
        position: 'relative',
        top: -30
      }
})