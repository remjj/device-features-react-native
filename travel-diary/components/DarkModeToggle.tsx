import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useTheme } from './ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import darkModeStyles from '../styles/darkMode';

const DarkModeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <TouchableOpacity style={darkModeStyles.toggle} onPress={toggleDarkMode}>
      <Ionicons
        name={isDarkMode ? 'moon' : 'sunny'}
        size={24}
        color={isDarkMode ? 'white' : 'black'}
      />
    </TouchableOpacity>
  );
};

export default DarkModeToggle;
