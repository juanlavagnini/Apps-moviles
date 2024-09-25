import { Stack, useNavigation } from "expo-router";
import { Button } from "react-native";

export default function RootLayout() {
  const navigation = useNavigation();
  
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
      <Stack.Screen
        name="modal_recipe"
        options={{
          title: "Recipe",
          presentation: 'modal',
          headerLeft: () => (
            <Button
              onPress={() => navigation.goBack()}
              title="Close"
              color="#000"
            />
          ),
        }}
      />
    </Stack>
  );
}
