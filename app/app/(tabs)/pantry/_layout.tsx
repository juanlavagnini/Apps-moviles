import CustomTabBar from "@/components/CustomTabBar";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Stack, Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: true, title: 'Pantry'}}/>
      <Stack.Screen name="pastProducts"  options={{headerShown: true, title:'Past Products'}}/>
    </Stack>
  );
}

