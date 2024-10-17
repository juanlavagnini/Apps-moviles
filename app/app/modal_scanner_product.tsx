import { Link, router, useLocalSearchParams} from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useScanContext } from './_layout';

export default function Modal() {

    const {product = ""} = useLocalSearchParams();
    const {setScan} = useScanContext();
    //const animation = new Animated.Value(0);

    return (
        <View style={styles.container}>
            <Text>Product</Text>
            <Text>{product}</Text>
            <View style={styles.buttonContainer}>
                <Pressable style={styles.closeButton} onPress={() => {setScan(false); router.navigate({pathname: '/scanner'})} }>
                    <Text style={styles.buttonText}>Cancel</Text>
                </Pressable>
                <Pressable style={styles.addButton}>
                    <Text style={styles.buttonText}>Add</Text> 
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 60,
    marginVertical: 200,
    backgroundColor: '#fff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 10,
    margin: 10,
  },
  closeButton: {
    flex: 1,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    flex: 1,
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});