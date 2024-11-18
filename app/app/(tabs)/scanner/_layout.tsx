import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";
import { createContext, ReactNode, useContext, useState } from "react";
import { useColorScheme } from "react-native";


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

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;
  return (
    <ScanContexProvider>
      <Stack>
      <Stack.Screen name="index" options={{ headerShown: false,headerStyle: {backgroundColor: theme.background}, headerTintColor: theme.grey, title: 'Scanner'}}/>
      <Stack.Screen
                name="modal_scanner_product"
                options={{
                  title: "add_product",
                  presentation: 'transparentModal',
                  headerShown: false,
                }}
              />
      </Stack>
    </ScanContexProvider>
  );
}

