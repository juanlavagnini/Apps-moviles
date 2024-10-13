import { Stack, useNavigation } from "expo-router";
import { Button } from "react-native";

export default function RootLayout() {
  const navigation = useNavigation();
  
  return (
    <Stack>
      <Stack.Screen name="index" options={{headerShown: false}}/>
      <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
      <Stack.Screen
        name="modal_recipe"
        options={{
          title: "Recipe",
          presentation: 'modal', //"transparentModal"
          //animation: "none",
          //headerShown: false,
          headerLeft: () => (
            <Button
              onPress={() => navigation.goBack()}
              title="Close"
              color="#000"
            />
          ),
        }}
      />
      <Stack.Screen
        name="modal_scanner_product"
        options={{
          title: "add_product",
          presentation: 'transparentModal',
          headerShown: false,
        }}
      />
      <Stack.Screen name="login" options={{headerShown: false}}/>
      <Stack.Screen name="signup"/>
    </Stack>
  );
}
