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
            <Text style={[styles.title, {color: theme.contrast}]}>Choose a {category}</Text>
            <FlatList
                data={data}
                keyExtractor={(item) => item}
                renderItem={({ item }) => 
                    <TouchableOpacity
                        style={[styles.categoryButton,, {backgroundColor: theme.lightOrange}]}
                        onPress={() => router.push({pathname: '/recipes/meal_recipe', params: {meal: item}})}>
                        <Text style={styles.categoryText}>{item}</Text>
                    </TouchableOpacity>}
                style={styles.categoryList}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                ListFooterComponent={<View style={{ height: 50 }}></View>}
                numColumns={2} // Muestra los elementos en dos columnas
                columnWrapperStyle={{ justifyContent: 'space-around' }}/>
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
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        alignSelf: 'center',
        fontWeight: 'bold',
        marginTop: 12,
        marginBottom: 10,
    },
    categoryButton: {
        width: '40%',
        aspectRatio: 1.5, // Hace que los elementos sean cuadrados
        backgroundColor: '#00aaff',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
      },
      categoryList: {
        minHeight: 40,
        marginVertical: 10,
      },
      categoryText: {
        fontSize: 18,
        fontWeight: 'bold',
        padding: 10,
      },
})