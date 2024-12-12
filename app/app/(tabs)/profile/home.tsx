import { StyleSheet, Text, View, Pressable, ScrollView,useColorScheme, RefreshControl, FlatList } from 'react-native'
import React, { useEffect } from 'react'
import { Colors } from '@/constants/Colors'
import { useUserContext } from '@/app/_layout';
import { router } from 'expo-router';
import Logbutton from '@/components/Logbutton';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { icons } from '@/constants/Avatars';
import { useAvatarContext } from './_layout';
import QRCode from 'react-native-qrcode-svg';


const index = () => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;
  
  const { user, setUser } = useUserContext();
  const URL = process.env.EXPO_PUBLIC_SERVER_URL;

  const { selected, setSelected } = useAvatarContext();

  const [users, setUsers] = React.useState<{ name: string; id: string }[]>([]);

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

  
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    getUsers();
  },[]);

  const handleDeleteMember = (id: string) => () => {
    console.log('Removing member');
    fetch(`${URL}/house/removeMember`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        removedUserId: id,
      }),
    })
    .then((response: Response) => response.json())
    .then((data: any) => {
      console.log(data);
      getUsers();
    });
}

  const Item = ({ item }: { item: { name: string; id: string } }) => {
    return (
      <View>
        <View style={[styles.selectorItem,{borderColor: theme.contrast}]}>
          <Text style={{color: theme.contrast}}>{item.name}</Text>
          <Pressable onPress={handleDeleteMember(item.id)}  hitSlop={6}>
            <Ionicons name="close" size={24} color={theme.contrast} />
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, {backgroundColor: theme.background}]}>
        <Text style={{color: theme.text}}>Invite members</Text>
        <View style={styles.qrcode}>
        <QRCode value={user?.email} size={200} />
        </View>
        <Text style={{color: theme.text}}>Members</Text>
        <FlatList
            style={{width:"90%",padding:10,marginBottom: 10}}
            data={users}
            renderItem={({ item }) => (Item({item}))}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={() => <View style={{height:8}} />}
                >
        </FlatList>
    </View>
  )
}

export default index

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 60,
        gap: 20,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    qrcode: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
    },
    selectorItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
      }
});