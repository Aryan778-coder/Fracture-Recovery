import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  darkColors,
  layout,
  lightColors,
  spacing,
  ThemeColors,
  typography,
} from '../constants/theme';

type ColorScheme = 'light' | 'dark';

interface ThemeContextType {
  isDark: boolean;
  colors: ThemeColors;
  typography: typeof typography;
  spacing: typeof spacing;
  layout: typeof layout;
  toggleTheme: () => void;
  setTheme: (mode: ColorScheme) => void;
}

const THEME_STORAGE_KEY = '@ossacare_theme_mode';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useState<ColorScheme>(systemScheme === 'dark' ? 'dark' : 'light');

  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY).then((saved) => {
      if (saved === 'light' || saved === 'dark') {
        setColorScheme(saved);
      }
    });
  }, []);

  const toggleTheme = () => {
    const next = colorScheme === 'dark' ? 'light' : 'dark';
    setColorScheme(next);
    AsyncStorage.setItem(THEME_STORAGE_KEY, next);
  };

  const setTheme = (mode: ColorScheme) => {
    setColorScheme(mode);
    AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
  };

  const isDark = colorScheme === 'dark';
  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        colors,
        typography,
        spacing,
        layout,
        toggleTheme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
