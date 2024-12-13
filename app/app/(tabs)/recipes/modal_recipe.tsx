import { Ionicons } from '@expo/vector-icons';
import {useLocalSearchParams, router} from 'expo-router';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Modal from 'react-native-modal';

export default function recipe_modal() {

    const {name = "receta"} = useLocalSearchParams();
    
    return (
      <SafeAreaProvider>
      <SafeAreaView style={styles.centeredView}>
        <Modal 
          isVisible={true}
          onBackButtonPress={() => router.back()}
          onBackdropPress={() => router.back()}
          >
            <View style={styles.centeredView}>
            <View style={styles.modalView}>
            <View style={styles.buttonContainer}>
              <Pressable style={styles.closeButton} 
                  onPress={() => {
                    router.back();
                    }} >
                  <Ionicons name="close-circle" size={40} color="black" />
              </Pressable>
            </View>
            <Text style={styles.text}>{name}</Text>
            </View>
            </View>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '70%',
    margin: 10,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'white',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  closeButton: {
    margin: -15,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
});