import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";
import { createContext, ReactNode, useContext, useState } from "react";
import { useColorScheme } from "react-native";

export const AvatarContext = createContext({
  selected: 1,
  setSelected: (selected: number) => {}
});

export const AvatarContextProvider = ({children}: {children: ReactNode}) => {
  const [selected, setSelected] = useState<number>(1);
  return (
    <AvatarContext.Provider value={{selected, setSelected}}>
      {children}
    </AvatarContext.Provider>
  );
}

export const useAvatarContext = () => {
  return useContext(AvatarContext);
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

  return (
    <AvatarContextProvider>
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: true,headerStyle: {backgroundColor: theme.background}, headerTintColor: theme.grey, title: 'Profile'}}/>
      <Stack.Screen name="user" />
      <Stack.Screen name="modal_edit_profile" options={{
                  presentation: 'transparentModal',
                  headerShown: false,
                }}/>
      <Stack.Screen name="invite_qr" options={{
                  presentation: 'transparentModal',
                  headerShown: false,
                }}/>
      <Stack.Screen name="join_house" options={{
                  presentation: 'transparentModal',
                  headerShown: false,
                }}/>
    </Stack>
    </AvatarContextProvider>
  );
}

