import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import React from 'react'
import QRCode from 'react-native-qrcode-svg';
import { useUserContext } from '@/app/_layout';
import { router } from 'expo-router';
import { Pressable, TextInput} from 'react-native';
import Modal  from 'react-native-modal'
import { Ionicons } from '@expo/vector-icons';

const invite_qr = () => {

    const { user } = useUserContext();
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
                <Text>Invite members</Text>
                <QRCode value={user?.email} size={200} />
              </View>
            </View>
          </Modal>
        </SafeAreaView>
        </SafeAreaProvider>
  )
}

export default invite_qr

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
      heading: {
        fontSize: 25,
        marginBottom: 10,
      },
      text: {
        fontSize: 16,
        marginBottom: 10,
      },
      buttonContainer: {
        flex: 1,
        backgroundColor: 'white',
        position: 'absolute',
        top: 0,
        left: 0,
      },
      buttons: {
        flexDirection: 'row', 
        gap: 10,
      },
      closeButton: {
        margin: -15,
      },
})