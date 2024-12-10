//Quiero crear una grilla custom para insertar en un modal
//La grilla deberia tener 3 columnas y 3 filas
//Cada celda deberia tener iconos de Ionicons que sea seleccionable
//La celda seleccionada deberia cambiar de color cuando se seleccione

import React, { useState } from 'react';
import { View, StyleSheet, Pressable, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAvatarContext } from '@/app/(tabs)/profile/_layout';
import { Colors } from '@/constants/Colors';
import { icons } from '@/constants/Avatars';

const CustomGrid = () => {
    const { selected, setSelected } = useAvatarContext();
    const [localSelected, setlocalSelected] = useState<number | null>(null);

  
    const colorScheme = useColorScheme();
    const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

    return (
        <View style={styles.container}>
            {icons.map((icon, index) => (
                <Pressable key={icon} style={[styles.cell, selected === index ? { backgroundColor: theme.lightOrange } : {}]
                } onPress={()=> setSelected(index)}>
                    <Ionicons name={icon} size={40} />
                </Pressable>
            ))}
        </View>
    )
}

export default CustomGrid;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 5,
        marginBottom: 10,
    },
    cell: {
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 10,
    },
    selected: {
        backgroundColor: "#F5DFC7",
    }
})