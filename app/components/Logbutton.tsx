import { Colors } from '@/constants/Colors';
import { StyleSheet, Pressable, Text } from 'react-native';

interface LogbuttonProps {
  onPress: () => void;
  title: string;
}

const Logbutton: React.FC<LogbuttonProps> = ({ onPress, title }) => {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  );
}

export default Logbutton;

const styles = StyleSheet.create({
    button: {
        width: '20%',
        height: 40,
        backgroundColor: "#673ab7",
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginBottom: 15,
      },
      buttonText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: 'bold',
      },
});