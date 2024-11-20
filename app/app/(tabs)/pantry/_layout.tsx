import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;
  
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: true,headerStyle: {backgroundColor: theme.background}, headerTintColor: theme.grey, title: 'Pantry'}}/>
      <Stack.Screen name="pastProducts"  options={{headerShown: true,headerStyle: {backgroundColor: theme.background}, headerTintColor: theme.grey, title:'Past Products'}}/>
      <Stack.Screen
                name="modal_product"
                options={{
                  title: "product_info",
                  presentation: 'transparentModal',
                  headerShown: false,
                }}
              />
    </Stack>
  );
}

