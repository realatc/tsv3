import React, { createContext, useContext, useRef, useState, RefObject, useEffect } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SentryAlertModalType = {
  message: string;
  details?: {
    level: string;
    type: string;
    description: string;
    time: string;
    location: string;
    alertId?: string;
    eventId?: string;
  };
  notification?: string[];
  responses?: string[];
  footer?: string;
  alertId?: string;
  id?: string;
  onOk?: ((alertId: string) => void) | null;
  onCall?: (() => void) | null;
  onText?: (() => void) | null;
};

type AppContextType = {
  settingsSheetRef: RefObject<BottomSheet>;
  contactResponseModal: null | { message: string; threatType?: string; responseType?: string; timestamp?: string; alertId?: string };
  setContactResponseModal: React.Dispatch<React.SetStateAction<null | { message: string; threatType?: string; responseType?: string; timestamp?: string; alertId?: string }>>;
  sentryAlertModal: SentryAlertModalType | null;
  setSentryAlertModal: React.Dispatch<React.SetStateAction<SentryAlertModalType | null>>;
  ezModeEnabled: boolean;
  setEzModeEnabled: (enabled: boolean) => void;
};

const AppContext = createContext<AppContextType | null>(null);

let globalSetContactResponseModal: null | ((modal: null | { message: string; threatType?: string; responseType?: string; timestamp?: string; alertId?: string }) => void) = null;
export const setGlobalContactResponseModal = (modal: null | { message: string; threatType?: string; responseType?: string; timestamp?: string; alertId?: string }) => {
  console.log('[setGlobalContactResponseModal] called with:', modal);
  if (globalSetContactResponseModal) {
    globalSetContactResponseModal(modal);
  } else {
    console.warn('[AppContext] setGlobalContactResponseModal called before provider is ready');
  }
};

let globalSetSentryAlertModal: null | ((modal: SentryAlertModalType | null) => void) = null;
let lastModalContent: SentryAlertModalType | null = null;
export const setGlobalSentryAlertModal = (modal: SentryAlertModalType | null) => {
  console.log('[setGlobalSentryAlertModal] called with:', modal);
  if (modal === lastModalContent) {
    console.warn('[setGlobalSentryAlertModal] Prevented duplicate modal set');
    return;
  }
  lastModalContent = modal;
  if (globalSetSentryAlertModal) {
    globalSetSentryAlertModal(modal);
  } else {
    console.warn('[AppContext] setGlobalSentryAlertModal called before provider is ready');
  }
};

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const settingsSheetRef = useRef<BottomSheet>(null);
  const [contactResponseModal, setContactResponseModal] = useState<null | { message: string; threatType?: string; responseType?: string; timestamp?: string; alertId?: string }>(null);
  const [sentryAlertModal, setSentryAlertModal] = useState<SentryAlertModalType | null>(null);
  const [ezModeEnabled, setEzModeEnabledState] = useState<boolean>(false);

  // Load ezModeEnabled from AsyncStorage on mount
  useEffect(() => {
    AsyncStorage.getItem('ezModeEnabled').then(val => {
      if (val !== null) setEzModeEnabledState(val === 'true');
    });
  }, []);

  // Persist ezModeEnabled to AsyncStorage
  const setEzModeEnabled = (enabled: boolean) => {
    setEzModeEnabledState(enabled);
    AsyncStorage.setItem('ezModeEnabled', enabled ? 'true' : 'false');
  };

  useEffect(() => {
    globalSetContactResponseModal = setContactResponseModal;
    globalSetSentryAlertModal = setSentryAlertModal;
  }, [setContactResponseModal, setSentryAlertModal]);

  // The value will be memoized and only re-created if the ref changes.
  const value = React.useMemo(() => ({ settingsSheetRef, contactResponseModal, setContactResponseModal, sentryAlertModal, setSentryAlertModal, ezModeEnabled, setEzModeEnabled }), [settingsSheetRef, contactResponseModal, sentryAlertModal, ezModeEnabled]);

  return (
    <AppContext.Provider value={value as any}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
} 