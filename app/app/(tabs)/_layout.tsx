import CustomTabBar from "@/components/CustomTabBar";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Stack, Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <Tabs tabBar={props => <CustomTabBar {...props} />}>
      <Tabs.Screen name="index"   options={{ href: null }} />
      <Tabs.Screen name="pantry"  options={{headerShown: false}}/>
      <Tabs.Screen name="list"    options={{headerTitle: "Grocery List" ,title: 'List'}}/>
      <Tabs.Screen name="scanner" options={{title: 'Scanner'}}/>
      <Tabs.Screen name="recipes" options={{title: 'Recipes'}}/>
      <Tabs.Screen name="profile" options={{title: 'Profile'}}/>
    </Tabs>
  );
}

