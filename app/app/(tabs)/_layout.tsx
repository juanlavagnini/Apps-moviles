import CustomTabBar from "@/components/CustomTabBar";
import { Colors } from "@/constants/Colors";
import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";
import { createContext, ReactNode, useContext, useState } from "react";

export const RefreshContext = createContext({
  refresh: false,
  setRefresh: (refresh: boolean) => {}
});

export const RefreshContextProvider = ({children}: {children: ReactNode}) => {
  const [refresh, setRefresh] = useState(false);
  return (
    <RefreshContext.Provider value={{refresh, setRefresh}}>
      {children}
    </RefreshContext.Provider>
  );
}

export const useRefreshContext = () => {
  return useContext(RefreshContext);
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

  return (
    <RefreshContextProvider>
      <Tabs tabBar={props => <CustomTabBar {...props} />}>
        <Tabs.Screen name="index"   options={{ href: null }} />
        <Tabs.Screen name="pantry"  options={{headerShown: false}}/>
        <Tabs.Screen name="list"    options={{headerStyle: {backgroundColor: theme.background}, headerTintColor: theme.grey,headerTitle: "Grocery List" ,title: 'List'}}/>
        <Tabs.Screen name="scanner" options={{headerShown:false, headerStyle: {backgroundColor: theme.background}, headerTintColor: theme.grey,headerTitle: "Scanner" ,title: 'Scanner'}}/>
        <Tabs.Screen name="recipes" options={{headerStyle: {backgroundColor: theme.background}, headerTintColor: theme.grey,title: 'Recipes'}}/>
        <Tabs.Screen name="profile" options={{headerShown: false, headerStyle: {backgroundColor: theme.background}, headerTintColor: theme.grey,title: 'Profile'}}/>
      </Tabs>
    </RefreshContextProvider>
  );
}

