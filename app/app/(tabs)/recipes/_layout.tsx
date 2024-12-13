import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false,headerStyle: {backgroundColor: theme.background}, headerTintColor: theme.grey}}/>
      <Stack.Screen name="meals_options" options={{ headerShown: false,headerStyle: {backgroundColor: theme.background}, headerTintColor: theme.grey}}/>
      <Stack.Screen name="meal_recipe" options={{ headerShown: false,headerStyle: {backgroundColor: theme.background}, headerTintColor: theme.grey}}/>
      <Stack.Screen name="modal_recipe" options={{
                  presentation: 'transparentModal',
                  headerShown: false,
                }}/>
    </Stack>
  );
}

