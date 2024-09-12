import { Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{href: null}}/>
      <Tabs.Screen name="pantry"/>
      <Tabs.Screen name="list"/>
      <Tabs.Screen name="scanner"/>
      <Tabs.Screen name="recipes"/>
      <Tabs.Screen name="profile"/>
    </Tabs>
  );
}
