import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AccessibilitySettings {
  // Visual Accessibility
  highContrastMode: boolean;
  largeTextMode: boolean;
  colorBlindFriendly: boolean;
  reducedMotion: boolean;
  
  // Audio Accessibility
  audioAlerts: boolean;
  voiceDescriptions: boolean;
  screenReaderMode: boolean;
  
  // Haptic Feedback
  hapticFeedback: boolean;
  threatHaptics: boolean;
  
  // Customization
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  contrastLevel: 'normal' | 'high' | 'maximum';
  colorScheme: 'default' | 'colorblind-friendly' | 'high-contrast';
}

const defaultSettings: AccessibilitySettings = {
  highContrastMode: false,
  largeTextMode: false,
  colorBlindFriendly: false,
  reducedMotion: false,
  audioAlerts: false,
  voiceDescriptions: false,
  screenReaderMode: false,
  hapticFeedback: true,
  threatHaptics: true,
  fontSize: 'medium',
  contrastLevel: 'normal',
  colorScheme: 'default',
};

const STORAGE_KEY = '@threatsense/accessibility';

const AccessibilityContext = createContext<{
  settings: AccessibilitySettings;
  updateSetting: <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => void;
  resetToDefaults: () => void;
} | undefined>(undefined);

export const AccessibilityProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);

  // Load settings from AsyncStorage on mount
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsedSettings = JSON.parse(stored);
          setSettings({ ...defaultSettings, ...parsedSettings });
        }
      } catch (error) {
        console.log('Error loading accessibility settings:', error);
      }
    })();
  }, []);

  // Save settings to AsyncStorage whenever they change
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetToDefaults = () => {
    setSettings(defaultSettings);
  };

  return (
    <AccessibilityContext.Provider value={{ settings, updateSetting, resetToDefaults }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

// Helper functions for accessibility features
export const getAccessibleColors = (settings: AccessibilitySettings) => {
  if (settings.colorScheme === 'high-contrast') {
    return {
      background: '#000000',
      surface: '#FFFFFF',
      text: '#FFFFFF',
      textSecondary: '#CCCCCC',
      primary: '#FFFF00',
      danger: '#FF0000',
      warning: '#FF8800',
      success: '#00FF00',
    };
  }
  
  if (settings.colorScheme === 'colorblind-friendly') {
    return {
      background: '#1a1a1a',
      surface: '#2d2d2d',
      text: '#FFFFFF',
      textSecondary: '#B0BEC5',
      primary: '#4A90E2',
      danger: '#FF6B6B',
      warning: '#FFB300',
      success: '#43A047',
    };
  }
  
  // Default dark theme
  return {
    background: '#1a1a1a',
    surface: 'rgba(255,255,255,0.07)',
    text: '#FFFFFF',
    textSecondary: '#B0BEC5',
    primary: '#4A90E2',
    danger: '#FF6B6B',
    warning: '#FFB300',
    success: '#43A047',
  };
};

export const getAccessibleFontSize = (settings: AccessibilitySettings) => {
  const baseSize = 16;
  const multipliers = {
    small: 0.875,
    medium: 1,
    large: 1.25,
    'extra-large': 1.5,
  };
  
  return baseSize * multipliers[settings.fontSize];
};

export const getAccessibleSpacing = (settings: AccessibilitySettings) => {
  const baseSpacing = 8;
  const multipliers = {
    small: 0.75,
    medium: 1,
    large: 1.25,
    'extra-large': 1.5,
  };
  
  return baseSpacing * multipliers[settings.fontSize];
}; 