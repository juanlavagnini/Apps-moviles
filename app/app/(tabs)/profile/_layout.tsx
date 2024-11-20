import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";
import {Modal, StyleSheet, Pressable, View, TextInput, useColorScheme} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: true,headerStyle: {backgroundColor: theme.background}, headerTintColor: theme.grey, title: 'Profile'}}/>
      <Stack.Screen name="user" />
      <Stack.Screen name="modal_edit_profile" options={{
                  presentation: 'transparentModal',
                  headerShown: false,
                }}/>
      <Stack.Screen name="invite_qr" options={{
                  presentation: 'transparentModal',
                  headerShown: false,
                }}/>
      <Stack.Screen name="join_house" options={{
                  presentation: 'transparentModal',
                  headerShown: false,
                }}/>
    </Stack>
  );
}

