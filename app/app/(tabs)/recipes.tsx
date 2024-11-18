import { Colors } from '@/constants/Colors';
import { Link } from 'expo-router';
import React, { useRef } from 'react';
import {
  FlatList,
  SectionList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme
} from 'react-native';

interface SectionData {
  //index: number;
  title: string;
  data: string[];
}

const DATA: SectionData[] = [
  {
    title: 'Main dishes',
    data: ['Pizza', 'Burger', 'Risotto'],
  },
  {
    title: 'Sides',
    data: ['French Fries', 'Onion Rings', 'Fried Shrimps'],
  },
  {
    title: 'Drinks',
    data: ['Water', 'Coke', 'Beer'],
  },
  {
    title: 'Desserts',
    data: ['Cheese Cake', 'Ice Cream'],
  },
  {
    title: 'Salads',
    data: ['Caesar Salad', 'Greek Salad', 'Cobb Salad'],
  },
  {
    title: 'Soups',
    data: ['Tomato Soup', 'Chicken Noodle Soup', 'Minestrone'],
  },
  {
    title: 'Sandwiches',
    data: ['Club Sandwich', 'Grilled Cheese', 'BLT'],
  },
  {
    title: 'Pasta',
    data: ['Spaghetti', 'Fettuccine Alfredo', 'Penne Arrabbiata'],
  },
  {
    title: 'Breakfast',
    data: ['Pancakes', 'Waffles', 'Omelette'],
  },
  {
    title: 'Seafood',
    data: ['Grilled Salmon', 'Shrimp Scampi', 'Crab Cakes'],
  },
  {
    title: 'Vegetarian',
    data: ['Veggie Burger', 'Stuffed Bell Peppers', 'Vegetable Stir Fry'],
  },
  {
    title: 'Grill',
    data: ['BBQ Ribs', 'Grilled Vegetables', 'Steak'],
  },
  {
    title: 'Breads',
    data: ['Sourdough', 'Focaccia', 'Bagels'],
  },
  {
    title: 'Tacos',
    data: ['Beef Tacos', 'Chicken Tacos', 'Fish Tacos'],
  },
  {
    title: 'Smoothies',
    data: ['Berry Smoothie', 'Mango Smoothie', 'Green Smoothie'],
  },
  {
    title: 'Pastries',
    data: ['Croissants', 'Danish', 'Eclairs'],
  },
  {
    title: 'Asian',
    data: ['Sushi', 'Dim Sum', 'Spring Rolls'],
  },
  {
    title: 'Mexican',
    data: ['Enchiladas', 'Burritos', 'Quesadillas'],
  },
  {
    title: 'American',
    data: ['Cheeseburger', 'Hot Dog', 'Apple Pie'],
  },
  {
    title: 'Italian',
    data: ['Lasagna', 'Margarita Pizza', 'Carbonara'],
  },
  {
    title: 'French',
    data: ['Crepes', 'Ratatouille', 'Quiche Lorraine'],
  },
  {
    title: 'Greek',
    data: ['Gyro', 'Moussaka', 'Spanakopita'],
  },
];


const Recipes = () => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;
  
  const sectionListRef = useRef<SectionList<any>>(null);

  // Función para desplazarse a la sección
  //Hay que revisar esta función
  const scrollToSection = (index: number) => {
    sectionListRef.current?.scrollToLocation({
      sectionIndex: index,
      itemIndex: 1, //este deberia ser 0 para que vaya al principio de la sección
      animated: true,
    });
  };

  return (
    <View style={[styles.container,{backgroundColor: theme.background}]}>
      <FlatList
        style={[styles.categoryList]}
        horizontal
        data={DATA}
        keyExtractor={(item) => item.title}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={[styles.categoryButton,, {backgroundColor: theme.darkOrange}]}
            onPress={() => scrollToSection(index)}
          >
            <Text style={styles.categoryText}>{item.title}</Text>
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
      />

      <SectionList
        ref={sectionListRef}
        sections={DATA}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item }) => (
          <View style={[styles.item, {backgroundColor: theme.lightOrange}]}>
            <Link href={{
              pathname: '/modal_recipe',
              params: { name: item  },
            }}
            style={styles.title}>{item}</Link>
          </View>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={[styles.header, {color: theme.grey}]}>{title}</Text>
        )}
        stickySectionHeadersEnabled={true}
        ListFooterComponent={<View style={{height: 50}} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    paddingHorizontal: 16,
  },
  item: {
    padding: 20,
    marginVertical: 8,
    borderRadius: 10,
  },
  header: {
    fontSize: 32,
    paddingVertical: 5,
  },
  title: {
    fontSize: 24,
  },
  categoryList: {
    minHeight: 40,
    marginVertical: 10,
  },
  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  categoryText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Recipes;