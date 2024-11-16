import CustomTabBar from "@/components/CustomTabBar";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { Stack, Tabs } from "expo-router";
import { useColorScheme } from "react-native";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

  return (
    <Tabs tabBar={props => <CustomTabBar {...props} />}>
      <Tabs.Screen name="index"   options={{ href: null }} />
      <Tabs.Screen name="pantry"  options={{headerShown: false}}/>
      <Tabs.Screen name="list"    options={{headerStyle: {backgroundColor: theme.background}, headerTintColor: theme.grey,headerTitle: "Grocery List" ,title: 'List'}}/>
      <Tabs.Screen name="scanner" options={{headerStyle: {backgroundColor: theme.background}, headerTintColor: theme.grey,title: 'Scanner'}}/>
      <Tabs.Screen name="recipes" options={{headerStyle: {backgroundColor: theme.background}, headerTintColor: theme.grey,title: 'Recipes'}}/>
      <Tabs.Screen name="profile" options={{headerShown: false, headerStyle: {backgroundColor: theme.background}, headerTintColor: theme.grey,title: 'Profile'}}/>
    </Tabs>
  );
}

