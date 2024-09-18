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
    id: "1",
    title: 'First Item',
  },
  {
    id: "2",
    title: 'Second Item',
  },
  {
    id: "3",
    title: 'Third Item',
  },
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

});

export default List;
