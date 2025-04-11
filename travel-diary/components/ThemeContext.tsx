import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Appearance } from 'react-native';

// Define the type of the context state
interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

// Create a context with a default value
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Create a provider to wrap around the app
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize the dark mode based on system preferences (optional)
  const systemPrefersDark = Appearance.getColorScheme() === 'dark';
  const [isDarkMode, setIsDarkMode] = useState(systemPrefersDark);

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
