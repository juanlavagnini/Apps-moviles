import { FlatList, StatusBar, ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View, Image } from 'react-native';
import React, { useEffect } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import LottieView from 'lottie-react-native';
import { Colors } from '@/constants/Colors';

const meal_recipie = () => {
  const { meal } = useLocalSearchParams();
  const [data, setData] = React.useState<{
    instructions: string;
    ingredients: string[];
    image: string;
  }>({
    instructions: '',
    ingredients: [],
    image: '',
  });
  const [isLoading, setIsLoading] = React.useState(true);

  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

  const modifyMeal = (meal: string) => meal.replace(/ /g, '%20');

  const getRecipie = (mealName: string) => {
    const encodedMeal = modifyMeal(mealName);
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodedMeal}`)
      .then((response) => response.json())
      .then((json) => {
        const mealData = json.meals[0];
        const ingredients = [];

        for (let i = 1; i <= 20; i++) {
          const ingredient = mealData[`strIngredient${i}`];
          const measure = mealData[`strMeasure${i}`];
          if (ingredient && ingredient.trim() !== '') {
            ingredients.push(`${measure} ${ingredient}`);
          }
        }

        setData({
          instructions: mealData.strInstructions,
          ingredients: ingredients,
          image: mealData.strMealThumb,
        });
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (typeof meal === 'string') {
      getRecipie(meal);
    }
  }, [meal]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>  
      {isLoading && (
        <LottieView
          source={require('@/assets/loading.json')}
          autoPlay
          loop
          style={{ width: 100, height: 100, alignSelf: 'center' }}
        />
      )}
      {!isLoading && (
        <>
          <ScrollView>
          <Text style={[styles.title, { color: theme.contrast }]}>{meal}</Text>
          <Image source={{ uri: data.image }} style={styles.image} />
          <Text style={[styles.sectionTitle, { color: theme.contrast }]}>Ingredients:</Text>
          {data.ingredients.map((item, index) => (
            <View key={`${item}-${index}`} style={[styles.ingredientContainer, { backgroundColor: theme.lightOrange }]}> 
              <Text style={styles.ingredientText}>{item}</Text>
            </View>
          ))}
          <Text style={[styles.sectionTitle, { color: theme.contrast }]}>Instructions:</Text>
          <View style={[styles.categoryList, { backgroundColor: theme.lightOrange }]}>
            <Text style={[styles.instructions]}>{data.instructions}</Text>
          </View>
          <View style={{height: 50}}></View>
        </ScrollView>
        </>
      )}
    </View>
  );
};

export default meal_recipie;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    alignSelf: 'center',
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginVertical: 15,
  },
  ingredientContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginVertical: 5,
    borderRadius: 5,
  },
  ingredientText: {
    fontSize: 16,
  },
  categoryList: {
    minHeight: 40,
    marginVertical: 10,
    padding: 10,
    borderRadius: 10,
    paddingRight: 10,
    paddingLeft: 10,
  },
  instructions: {
    fontSize: 16,
    marginTop: 10,
    lineHeight: 22,
  },
});
