import React, { forwardRef } from 'react';
import { TextInput, StyleSheet, TextInputProps, StyleProp, TextStyle } from 'react-native';

interface CustomTextInputProps extends TextInputProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onSubmitEditing?: () => void;
  returnKeyType?: 'done' | 'next' | 'go' | 'search' | 'send';
  style?: StyleProp<TextStyle>; // Permite pasar estilos personalizados
  placeholderTextColor?: string;
}

const CustomTextInput = forwardRef<TextInput, CustomTextInputProps>(({
  placeholder,
  value,
  onChangeText,
  onSubmitEditing,
  returnKeyType = 'next',
  style = {},
  placeholderTextColor = '#666',
  ...props
}, ref) => {
  return (
    <TextInput
      ref={ref}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      style={[styles.input, style]}
      placeholderTextColor={placeholderTextColor}
      returnKeyType={returnKeyType}
      onSubmitEditing={onSubmitEditing}
      {...props}
    />
  );
});

const styles = StyleSheet.create({
    input: {
        width: '80%',
        height: 50,
        borderBottomWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 20,
      },
      inputIncorrect: {
        width: '80%',
        height: 50,
        borderBottomWidth: 1,
        borderColor: "red",
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 20,
    
      },
});

export default CustomTextInput;
