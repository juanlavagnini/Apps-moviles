import CustomTabBar from "@/components/CustomTabBar";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Stack, Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index"/>
      <Stack.Screen name="login"  options={{headerShown:false, title: "Login"}}/>
      <Stack.Screen name="signup" options={{ title: "SignUp"}}/>
      <Stack.Screen name="user" options={{headerShown:false}}/>
    </Stack>
  );
}

