import { Stack, useNavigation } from "expo-router";
import { createContext, useContext, useState } from "react";
import { Button } from "react-native";

export const ScanContext = createContext({
  setScan : (scan: boolean) => {},
  scan: false
});

import { ReactNode } from "react";

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

export default function RootLayout() {
  const navigation = useNavigation();
  
  return (
    <ScanContexProvider>
    <Stack>
      <Stack.Screen name="index" options={{headerShown: false}}/>
      <Stack.Screen name="(tabs)" options={{headerShown: false , gestureEnabled: false}}/>
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
      <Stack.Screen
        name="modal_scanner_product"
        options={{
          title: "add_product",
          presentation: 'transparentModal',
          headerShown: false,
        }}
      />
      <Stack.Screen name="login" options={{headerShown: false, gestureEnabled: false}}/>
      <Stack.Screen name="signup" options={{gestureEnabled: false}}/>
    </Stack>
    </ScanContexProvider>
  );
}
