import { FlatList, StatusBar, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native'
import React, { useEffect } from 'react'
import { router, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/Colors';
import LottieView from 'lottie-react-native';

const meals_options = () => {

    const { category } = useLocalSearchParams();
    const [data, setData] = React.useState<string[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    const colorScheme = useColorScheme();
    const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

    const getRecipes = (category: string) => {
        console.log(category);
        fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
          .then((response) => response.json())
          .then((json) => {
            const meals = json.meals.map((meal: any) => meal.strMeal);
            setData(meals);
            setIsLoading(false);
          })
          .catch((error) => {
            console.error(error);
          });

    }

    useEffect(() => {
        if (typeof category === 'string') {
            getRecipes(category);
        }
    },[category]);

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
            <Text style={[styles.title, {color: theme.contrast}]}>{category}</Text>
            <FlatList
                data={data}
                keyExtractor={(item) => item}
                renderItem={({ item }) => 
                    <TouchableOpacity
                        style={[styles.categoryButton,, {backgroundColor: theme.darkOrange}]}
                        onPress={() => router.push({pathname: '/recipes/meal_recipe', params: {meal: item}})}>
                        <Text style={styles.categoryText}>{item}</Text>
                    </TouchableOpacity>}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                ListFooterComponent={<View style={{ height: 50 }}></View>}/>
            </>
            )}
        </View>
    )
}

export default meals_options

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 28,
        alignSelf: 'center',
        paddingVertical: 5,
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
})