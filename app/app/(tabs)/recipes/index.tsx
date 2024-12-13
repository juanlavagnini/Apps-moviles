import { Colors } from '@/constants/Colors';
import { Link, router } from 'expo-router';
import LottieView from 'lottie-react-native';
import React, { useEffect, useRef } from 'react';
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
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

interface SectionData {
  //index: number;
  title: string;
  data: string[];
}

const DATA: SectionData[] = [];


const Recipes = () => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;
  
  const sectionListRef = useRef<SectionList<any>>(null);

  const [isLoading, setIsLoading] = React.useState(true);

  // Función para desplazarse a la sección
  //Hay que revisar esta función
  const scrollToSection = (index: number) => {
    sectionListRef.current?.scrollToLocation({
      sectionIndex: index,
      itemIndex: 1, //este deberia ser 0 para que vaya al principio de la sección
      animated: true,
    });
  };

  const getRecipes = (category: string) => {
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
      .then((response) => response.json())
      .then((json) => {
        const index = DATA.findIndex((element) => element.title === category);
        console.log(DATA[index].data);
        const meals = json.meals.map((meal: any) => meal.strMeal);
        meals.forEach((meal: string) => { DATA[index].data.push(meal); });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  //Consulta a la api de TheMealDB para obtener las categorías
  //https://www.themealdb.com/api/json/v1/1/categories.php
  //Me quiero quedar con el id y el strCategory
  const getCategories = async () => {
    try {
      const response = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
      const json = await response.json();
      json.categories.forEach((category: any) => {
        DATA.push({ title: category.strCategory, data: [] });
      });
      json.categories.forEach((category: any) => {
        getRecipes(category.strCategory);
      });
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getCategories();
  },[]);

  
  return (
    <View style={[styles.container,{backgroundColor: theme.background}]}>
      {isLoading && <LottieView
                  source={require('@/assets/loading.json')}
                  autoPlay
                  loop
                  style={{ width: 100, height: 100, alignSelf: 'center' }}
                />}
      {!isLoading && (
        <>
        <FlatList
        data={DATA}
        keyExtractor={(item) => item.title}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={[styles.categoryButton,, {backgroundColor: theme.darkOrange}]}
            onPress={() => router.push({pathname: '/recipes/meals_options', params: {category: item.title}})}
          >
            <Text style={styles.categoryText}>{item.title}</Text>
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />
      </>
    )}
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