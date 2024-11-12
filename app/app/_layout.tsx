import { Stack, useNavigation } from "expo-router";
import { Button } from "react-native";
import { createContext, ReactNode, useContext, useState } from "react";

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


//UserContext

//objeto user
interface User {
  id: number;
  email: string;
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
  const navigation = useNavigation();
  
  return (
    <UserContextProvider>
      <RefreshContextProvider>
        <ScanContexProvider>
            <Stack>
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
              <Stack.Screen name="signup" options={{gestureEnabled: false}}/>
            </Stack>
        </ScanContexProvider>
      </RefreshContextProvider>
    </UserContextProvider>
  );
}
