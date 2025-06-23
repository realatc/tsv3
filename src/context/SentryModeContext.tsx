import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { threatAnalysisService } from '../services/threatAnalysisService';

export interface SentryModeSettings {
  isEnabled: boolean;
  threatLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  trustedContact: {
    name: string;
    phoneNumber: string;
  } | null;
}

interface SentryModeContextType {
  settings: SentryModeSettings;
  updateSettings: (newSettings: Partial<SentryModeSettings>) => Promise<void>;
  resetSettings: () => Promise<void>;
  isLoading: boolean;
}

const SentryModeContext = createContext<SentryModeContextType | undefined>(undefined);

const STORAGE_KEY = 'sentry_mode_settings';

const defaultSettings: SentryModeSettings = {
  isEnabled: false,
  threatLevel: 'High',
  trustedContact: null,
};

export const SentryModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SentryModeSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const storedSettings = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedSettings) {
        const parsedSettings = JSON.parse(storedSettings);
        const finalSettings = { ...defaultSettings, ...parsedSettings };
        setSettings(finalSettings);
        threatAnalysisService.setSentryModeSettings(finalSettings);
      } else {
        threatAnalysisService.setSentryModeSettings(defaultSettings);
      }
    } catch (error) {
      console.error('Error loading Sentry Mode settings:', error);
      threatAnalysisService.setSentryModeSettings(defaultSettings);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<SentryModeSettings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSettings));
      threatAnalysisService.setSentryModeSettings(updatedSettings);
    } catch (error) {
      console.error('Error saving Sentry Mode settings:', error);
    }
  };

  const resetSettings = async () => {
    try {
      setSettings(defaultSettings);
      await AsyncStorage.removeItem(STORAGE_KEY);
      threatAnalysisService.setSentryModeSettings(defaultSettings);
    } catch (error) {
      console.error('Error resetting Sentry Mode settings:', error);
    }
  };

  return (
    <SentryModeContext.Provider value={{ settings, updateSettings, resetSettings, isLoading }}>
      {children}
    </SentryModeContext.Provider>
  );
};

export const useSentryMode = () => {
  const context = useContext(SentryModeContext);
  if (context === undefined) {
    throw new Error('useSentryMode must be used within a SentryModeProvider');
  }
  return context;
}; 