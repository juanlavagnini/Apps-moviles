import CustomTabBar from "@/components/CustomTabBar";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Stack, Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index"/>
      <Stack.Screen name="user" options={{headerShown:false}}/>
    </Stack>
  );
}

