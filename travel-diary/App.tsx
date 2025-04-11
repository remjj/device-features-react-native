import React from 'react';
import { ThemeProvider } from './components/ThemeContext';
import AppNavigation from './components/AppNavigation';
import DarkModeToggle from './components/DarkModeToggle';


const App = () => {
  return (
    <ThemeProvider>
      <DarkModeToggle/>
      <AppNavigation/>
    </ThemeProvider>
  );
};

export default App;
