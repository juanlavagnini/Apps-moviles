import { View, Text, TouchableOpacity, Pressable, Appearance, useColorScheme } from 'react-native';
import { StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import TabBarButtom from './TabBarButtom';
import TabBarButtomWithBackground from './TabBarButtomWithBackground';
import { Colors } from '@/constants/Colors';


const CustomTabBar = ({ state, descriptors, navigation } : BottomTabBarProps) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;
  //Use esta funcion para detectar si el dispositivo esta en modo oscuro
  //devuelve "dark" si esta en modo oscuro y "light" si esta en modo claro
  //Lo trasnforme a un booleano para que sea mas facil de usar
  if (state.routes[state.index].name === 'scanner') {
    return null;
  }
  return (
    <View style={[styles.tabbar, {backgroundColor: theme.background, shadowColor: theme.shadowColor}]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

       
        
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        //Lo que hace de aca para abajo es renderizar los botones de la barra de navegacion
        //Si el nombre de la ruta es "index" no se renderiza nada

        if(route.name === 'index') {
          return null;
        }
        //Si el nombre de la ruta es "scanner" se renderiza el boton con fondo
        if(route.name === 'scanner') {
          return (
            <TabBarButtomWithBackground
            key={route.name}
            onPress={onPress}
            onLongPress={onLongPress}
            isFocused={isFocused}
            routeName={route.name}
            color={'#222'}
            label={label}
          />
          );
        }
        //Para cualquier otra ruta se renderiza el boton estandar
        return (
          <TabBarButtom
            key={route.name}
            onPress={onPress}
            onLongPress={onLongPress}
            isFocused={isFocused}
            routeName={route.name}
            color={isFocused ? theme.tabIconSelected : theme.tabIconDefault}
            label={label}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
    tabbar: {
      position: 'relative', 
      width : '90%',
      bottom: 25,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginHorizontal: 'auto',
      borderRadius: 25,
      shadowRadius: 10,
      shadowOpacity: 0.3,
    }
})


export default CustomTabBar;