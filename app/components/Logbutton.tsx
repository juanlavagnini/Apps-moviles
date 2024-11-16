import { Colors } from '@/constants/Colors';
import { StyleSheet, Pressable, Text, useColorScheme } from 'react-native';

interface LogbuttonProps {
  onPress: () => void;
  title: string;
}

const Logbutton: React.FC<LogbuttonProps> = ({ onPress, title }) => {

  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;


  return (
    <Pressable style={[styles.button, {backgroundColor: theme.darkOrange}]} onPress={onPress}>
      <Text style={[styles.buttonText, {color: theme.lightBrown}]}>{title}</Text>
    </Pressable>
  );
}

export default Logbutton;

const styles = StyleSheet.create({
    button: {
        width: '20%',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginBottom: 15,
      },
      buttonText: {
        fontSize: 14,
        fontWeight: 'bold',
      },
});