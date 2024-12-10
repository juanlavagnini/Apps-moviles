import { Colors } from '@/constants/Colors';
import { StyleSheet, Pressable, Text, useColorScheme } from 'react-native';

interface LogbuttonProps {
  onPress: () => void;
  title: string;
  light?: boolean;
}

const Logbutton: React.FC<LogbuttonProps> = ({ onPress, title, light }) => {

  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;


  return (
    <Pressable style={[styles.button, { backgroundColor: light ? theme.lightOrange : theme.darkOrange }]} onPress={onPress}>
      <Text style={[styles.buttonText, {color: theme.darkBrown}]}>{title}</Text>
    </Pressable>
  );
}

export default Logbutton;

const styles = StyleSheet.create({
    button: {
        width: 'auto',
        padding: 5,
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