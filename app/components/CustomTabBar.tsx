import { View, Text, TouchableOpacity, Pressable, Appearance, useColorScheme } from 'react-native';
import { StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import TabBarButtom from './TabBarButtom';
import TabBarButtomWithBackground from './TabBarButtomWithBackground';
import { Colors } from '@/constants/Colors';


const CustomTabBar = ({ state, descriptors, navigation } : BottomTabBarProps) => {

  const isDarkMode = useColorScheme() === 'dark' ? true : false;
  //Use esta funcion para detectar si el dispositivo esta en modo oscuro
  //devuelve "dark" si esta en modo oscuro y "light" si esta en modo claro
  //Lo trasnforme a un booleano para que sea mas facil de usar

  return (
    <View style={styles.tabbar}>
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
            color={isFocused ? 
              (isDarkMode ? Colors.dark.tabIconSelected : Colors.light.tabIconSelected) : 
              (isDarkMode ? Colors.dark.tabIconDefault : Colors.light.tabIconDefault)}
            label={label}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
    tabbar: {
        position: 'absolute', 
        bottom: 25,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        marginHorizontal: 15,
        borderRadius: 25,
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 10},
        shadowRadius: 10,
        shadowOpacity: 0.1,
    }
})


export default CustomTabBar;