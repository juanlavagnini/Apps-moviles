import { GestureResponderEvent, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { TabBarIcon } from './navigation/TabBarIcon'

const TabBarButtom = ({onPress, onLongPress, isFocused, routeName, color, label}: {onPress: (event: GestureResponderEvent) => void, onLongPress: (event: GestureResponderEvent) => void, isFocused: boolean, routeName: string, color: string, label:any}) => {
    const icon: { [key: string]: (props: any) => JSX.Element } = {
        pantry: (props: any) => <TabBarIcon name="home" {...props} />,
        list: (props: any) => <TabBarIcon name="list" {...props} />,
        scanner: (props: any) => <TabBarIcon name="scan" {...props} />,
        recipes: (props: any) => <TabBarIcon name="book" {...props} />,
        profile: (props: any) => <TabBarIcon name="person" {...props} />
    }
  
    return (
    <Pressable
        onPress={onPress}
        onLongPress={onLongPress}
        style={styles.tabBarIcon}
        >
        {icon[routeName]({
            color: color
        })}
        <Text style={{ color: color }}>
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
        gap: 5
      }
})