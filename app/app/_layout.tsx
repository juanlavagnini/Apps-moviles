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

//UserContext

//objeto user
interface User {
  id: number;
  email: string;
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
    <ScanContexProvider>
    <Stack>
      <Stack.Screen name="index" options={{headerShown: false}}/>
      <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
      <Stack.Screen
        name="modal_recipe"
        options={{
          title: "Recipe",
          presentation: 'modal', //"transparentModal"
          //animation: "none",
          //headerShown: false,
          headerLeft: () => (
            <Button
              onPress={() => navigation.goBack()}
              title="Close"
              color="#000"
            />
          ),
        }}
      />
      <Stack.Screen name="login" options={{headerShown: false}}/>
      <Stack.Screen name="signup"/>
    </Stack>
    </ScanContexProvider>
    </UserContextProvider>
  );
}
