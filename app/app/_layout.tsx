import { Stack, useNavigation } from "expo-router";
import { Button } from "react-native";
import { createContext, ReactNode, useContext, useState } from "react";
import { useColorScheme } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { Colors } from "@/constants/Colors";

export const ScanContext = createContext({
  setScan : (scan: boolean) => {},
  scan: false
});

export const ScanContexProvider = ({children}: {children: ReactNode}) => {
  const [scan, setScan] = useState(false);
  return (
    <ScanContext.Provider value={{scan, setScan}}>
      {children}
    </ScanContext.Provider>
  );
}

export const useScanContext = () => {
  return useContext(ScanContext);
}

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

//ColorSchemeContext
export const ColorSchemeContext = createContext({
  colorScheme: 'light',
  setColorScheme: (colorScheme: 'light' | 'dark') => {}
});

export const ColorSchemeContextProvider = ({children}: {children: ReactNode}) => {
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('light');
  return (
    <ColorSchemeContext.Provider value={{colorScheme, setColorScheme}}>
      {children}
    </ColorSchemeContext.Provider>
  );
}

export const useColorSchemeContext = () => {
  return useContext(ColorSchemeContext);
}

//UserContext

//objeto user
interface User {
  id: number;
  email: string;
  name: string;
  surname: string;
  password: string;
  houseId: number;
  owner: boolean;
}

export const UserContext = createContext<{
  setUser: (user: User | null) => void;
  user: User | null;
}>({
  setUser: () => {},
  user: null
});

export const UserContextProvider = ({children}: {children: ReactNode}) => {
  const [user, setUser] = useState<User | null>(null);
  return (
    <UserContext.Provider value={{user, setUser}}>
      {children}
    </UserContext.Provider>
  );
}

export const useUserContext = () => {
  return useContext(UserContext);
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;
  return (
    <UserContextProvider>
      <RefreshContextProvider>
        <ScanContexProvider>
            <Stack screenOptions={{contentStyle: {backgroundColor: theme.background}}}>
              <Stack.Screen name="index" options={{headerShown: false}}/>
              <Stack.Screen name="(tabs)" options={{headerShown: false , gestureEnabled: false}}/>

              <Stack.Screen
                name="modal_scanner_product"
                options={{
                  title: "add_product",
                  presentation: 'transparentModal',
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="modal_product"
                options={{
                  title: "product_info",
                  presentation: 'transparentModal',
                  headerShown: false,
                }}
              />
              <Stack.Screen name="login" options={{headerShown: false, gestureEnabled: false}}/>
              <Stack.Screen name="signup" options={{gestureEnabled: false, headerTransparent: true, headerTintColor: colorScheme === "dark" ? 'white' : 'black'}}/>
            </Stack>
        </ScanContexProvider>
      </RefreshContextProvider>
    </UserContextProvider>
  );
}
