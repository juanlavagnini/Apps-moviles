import { Button, StyleSheet, Text, useColorScheme, View } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect } from 'react'
import { useUserContext } from '@/app/_layout';
import { router } from 'expo-router';
import { Pressable} from 'react-native';
import Modal  from 'react-native-modal'
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import Logbutton from '@/components/Logbutton';
import { FlatList } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useRefreshContext } from '../_layout';

const join_house = () => {

    const { user, setUser } = useUserContext();
    const { refresh, setRefresh } = useRefreshContext();

    const [permission, requestPermission] = useCameraPermissions();
    const [scan, setScan] = React.useState<boolean>(false);
    const URL = process.env.EXPO_PUBLIC_SERVER_URL;

    const [isAcepted, setIsAcepted] = React.useState<boolean>(false);
    const [isDelegated, setIsDelegated] = React.useState<boolean>(!user?.owner);
    const [selectedOwner, setSelectedOwner] = React.useState<string>('');

    const [users, setUsers] = React.useState<{ name: string; id: string }[]>([]);

    const colorScheme = useColorScheme();
    const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;
    
    useEffect(() => {
        if (!permission) requestPermission();
      }, [permission]);
      
      //Permisos de la camara
      // ------------------------------------------------------------
      if (!permission) {
        // Camera permissions are still loading.
        return <View />;
      }
    
      if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
          <View style={styles.container}>
            <Text style={styles.message}>We need your permission to show the camera</Text>
            <Button onPress={requestPermission} title="Grant permission" />
          </View>
        );
      }

    const handleJoinHouse = (ownerEmail: string) => {
        console.log(ownerEmail);
        fetch(`${URL}/house/join`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: user?.id,
                ownerEmail: ownerEmail,
                delegatedOwner: selectedOwner,
            }),
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            setUser({
              id: data.id,
              email: data.email,
              name: data.name,
              surname: data.surname,
              houseId: data.houseId,
              owner: data.ownedHouse,
            });
            setRefresh(!refresh);
            router.back();
        })
        
    }   

    const getUsers = async () => {
      console.log('Getting users');
      console.log(user?.id);
    
      try {
        const response = await fetch(`${URL}/house/members`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ownerId: user?.id,
          }),
        });
    
        const data = await response.json();
        console.log(data);
    
        // Actualiza el estado de los usuarios
        const formattedUsers = data.map((user: { id: number; name: string; surname: string }) => ({
          id: user.id.toString(),
          name: `${user.name} ${user.surname}`,
        }));
    
        setUsers(formattedUsers);
    
        // Evalúa después de actualizar el estado
        if (formattedUsers.length === 0) {
          setIsDelegated(true);
        }
    
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    


    const Item = ({ item }: { item: { name: string; id: string } }) => {
      return (
        <View>
          <Pressable onPress={() => setSelectedOwner(item.id)} style={[styles.selectorItem,{ backgroundColor: selectedOwner === item.id ? theme.lightOrange : 'transparent'}]}>
            <Text>{item.name}</Text>
          </Pressable>
        </View>
      );
    }

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
                {isAcepted && isDelegated ? (
                <CameraView style={{height: 200, width: 200}} 
                    onBarcodeScanned={(result) => {
                        setScan(true);
                        if (scan) return;
                        handleJoinHouse(result.data);
                    }}
                 />): (
                  isAcepted && !isDelegated ? 
                  (<View>
                    <Text style={{margin: 10, fontWeight: "bold"}}>Select new owner</Text>
                    <FlatList
                      style={{marginBottom: 10}}
                      data={users}
                      renderItem={({ item }) => (Item({item}))}
                      keyExtractor={(item) => item.id}
                      ItemSeparatorComponent={() => <View style={{height:5}} />}
                    >
                    </FlatList>
                    <Logbutton title="Accept" onPress={() => setIsDelegated(true)} />
                  </View>) 
                  : (
                 <View style={styles.viewAlert}>
                  <Text style={{alignSelf: "flex-start"}}>Are you sure that you want to join another house?</Text>
                  <Text style={{alignSelf: "flex-start", color: "red", fontStyle: "italic"}}>By accepting you will lose all your products</Text>
                  <View style={styles.alertButtons}>
                    <Logbutton title="Yes" onPress={() => {setIsAcepted(true), getUsers()}} />
                    <Logbutton title="No" onPress={() => router.back()} />
                  </View>

                </View>))}


              </View>
            </View>
          </Modal>
        </SafeAreaView>
        </SafeAreaProvider>
  )
}

export default join_house

const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        backgroundColor: 'black',
    },
    message: {
        justifyContent: 'center',
        textAlign: 'center',
        paddingBottom: 10,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      modalView: {
        width: '70%',
        height: "30%",
        margin: 10,
        justifyContent: 'center',
        alignContent: 'center',
        backgroundColor: "white",
        borderRadius: 20,
        padding: 15,
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
      viewAlert: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,
      },
      alertButtons: {
        marginTop: 10,
        flexDirection: 'row',
        gap: 10,
      },
      selectorItem: {
        padding: 10,
        borderRadius: 5,
        borderBottomWidth: 1,
        borderBottomColor: 'black',

      }
})