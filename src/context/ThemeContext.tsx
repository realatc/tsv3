import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Theme color definitions
export const lightTheme = {
  // Background colors
  background: '#FFFFFF',
  surface: '#F5F5F5',
  surfaceSecondary: '#E8E8E8',
  card: '#FFFFFF',
  
  // Text colors
  text: '#000000',
  textSecondary: '#666666',
  textTertiary: '#999999',
  
  // Primary colors
  primary: '#4A90E2',
  primaryLight: '#6BA3E8',
  primaryDark: '#357ABD',
  
  // Status colors
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
  
  // Threat level colors
  threatLow: '#4CAF50',
  threatMedium: '#FF9800',
  threatHigh: '#F44336',
  threatCritical: '#9C27B0',
  
  // Border colors
  border: '#E0E0E0',
  borderLight: '#F0F0F0',
  
  // Shadow colors
  shadow: 'rgba(0, 0, 0, 0.1)',
  
  // Overlay colors
  overlay: 'rgba(0, 0, 0, 0.5)',
  
  // Navigation colors
  tabBar: '#FFFFFF',
  tabBarInactive: '#999999',
  tabBarActive: '#4A90E2',
  
  // Input colors
  inputBackground: '#FFFFFF',
  inputBorder: '#E0E0E0',
  inputText: '#000000',
  inputPlaceholder: '#999999',
};

export const darkTheme = {
  // Background colors
  background: '#000000',
  surface: '#1C1C1E',
  surfaceSecondary: '#2C2C2E',
  card: '#1C1C1E',
  
  // Text colors
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  textTertiary: '#888888',
  
  // Primary colors
  primary: '#4A90E2',
  primaryLight: '#6BA3E8',
  primaryDark: '#357ABD',
  
  // Status colors
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
  
  // Threat level colors
  threatLow: '#4CAF50',
  threatMedium: '#FF9800',
  threatHigh: '#F44336',
  threatCritical: '#9C27B0',
  
  // Border colors
  border: '#2C2C2E',
  borderLight: '#3C3C3E',
  
  // Shadow colors
  shadow: 'rgba(0, 0, 0, 0.3)',
  
  // Overlay colors
  overlay: 'rgba(0, 0, 0, 0.7)',
  
  // Navigation colors
  tabBar: '#1C1C1E',
  tabBarInactive: '#888888',
  tabBarActive: '#4A90E2',
  
  // Input colors
  inputBackground: '#2C2C2E',
  inputBorder: '#3C3C3E',
  inputText: '#FFFFFF',
  inputPlaceholder: '#888888',
};

export type Theme = typeof lightTheme;

interface ThemeContextType {
  isLightMode: boolean;
  theme: Theme;
  toggleTheme: () => void;
  setLightMode: (isLight: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@threatsense_theme_mode';

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLightMode, setIsLightMode] = useState(false); // Default to dark mode

  // Load saved theme preference on app start
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme !== null) {
          setIsLightMode(JSON.parse(savedTheme));
        }
      } catch (error) {
        console.error('[ThemeContext] Error loading theme preference:', error);
        // Fallback to dark mode if there's an error
        setIsLightMode(false);
      }
    };

    loadThemePreference();
  }, []);

  // Save theme preference when it changes
  const saveThemePreference = async (isLight: boolean) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(isLight));
    } catch (error) {
      console.error('[ThemeContext] Error saving theme preference:', error);
    }
  };

  const toggleTheme = () => {
    const newMode = !isLightMode;
    setIsLightMode(newMode);
    saveThemePreference(newMode);
  };

  const setLightMode = (isLight: boolean) => {
    setIsLightMode(isLight);
    saveThemePreference(isLight);
  };

  const theme = isLightMode ? lightTheme : darkTheme;

  const value: ThemeContextType = {
    isLightMode,
    theme,
    toggleTheme,
    setLightMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 