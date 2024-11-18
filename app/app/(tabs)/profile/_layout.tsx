import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

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
    </Stack>
  );
}

