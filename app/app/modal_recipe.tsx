import {useLocalSearchParams} from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function Modal() {

    const {name = "receta"} = useLocalSearchParams();
    //const animation = new Animated.Value(0);

    return (
        <View style={styles.container}>
            <Text>{name}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});