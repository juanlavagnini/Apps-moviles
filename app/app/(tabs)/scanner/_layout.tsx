import CustomTabBar from "@/components/CustomTabBar";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { Stack, Tabs } from "expo-router";
import { useColorScheme } from "react-native";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false,headerStyle: {backgroundColor: theme.background}, headerTintColor: theme.grey, title: 'Scanner'}}/>
      <Stack.Screen
                name="modal_scanner_product"
                options={{
                  title: "add_product",
                  presentation: 'transparentModal',
                  headerShown: false,
                }}
              />
    </Stack>
  );
}

