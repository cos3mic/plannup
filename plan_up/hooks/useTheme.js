import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [userTheme, setUserTheme] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserTheme();
  }, []);

  const loadUserTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('userTheme');
      if (savedTheme) {
        setUserTheme(savedTheme);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setTheme = useCallback(async (theme) => {
    try {
      await AsyncStorage.setItem('userTheme', theme);
      setUserTheme(theme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  }, []);

  // Determine the actual color scheme to use
  const colorScheme = userTheme || systemColorScheme || 'light';

  const value = {
    colorScheme,
    userTheme,
    setTheme,
    isLoading,
    isSystemTheme: !userTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 