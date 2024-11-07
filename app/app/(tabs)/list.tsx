import React, { useRef } from 'react';
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  StatusBar,
  SectionList,
  TouchableOpacity,
} from 'react-native';

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First Item',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Second Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
  }
];




type ItemProps = {title: string};

const Item = ({title}: ItemProps) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

const List = () => {
  // Declare and initialize sectionListRef
  const sectionListRef = useRef<SectionList<any>>(null);

  // Función para desplazarse a la sección
  const scrollToSection = (index: any) => {
    sectionListRef.current?.scrollToLocation({
      sectionIndex: index,
      itemIndex: 0, // Puedes ajustar esto si necesitas que se enfoque un elemento específico
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={DATA}
        renderItem={({item}) => <Item title={item.title} />}
        keyExtractor={item => item.id}
        ListFooterComponent={<View style={{height: 50}} />}
        ListEmptyComponent={<Text style = {styles.textEmpty}>It is not necessary to go to the supermarket!</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },

  categoryList: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  textEmpty: {
    textAlign: 'center',
    fontSize: 20,
    marginTop: 5,
  }

});

export default List;
