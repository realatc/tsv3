import React, { createContext, useContext, useRef, useState, RefObject, useEffect } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';

type AppContextType = {
  settingsSheetRef: RefObject<BottomSheet>;
  contactResponseModal: null | { message: string; threatType?: string; responseType?: string; timestamp?: string; alertId?: string };
  setContactResponseModal: React.Dispatch<React.SetStateAction<null | { message: string; threatType?: string; responseType?: string; timestamp?: string; alertId?: string }>>;
  sentryAlertModal: any;
  setSentryAlertModal: React.Dispatch<React.SetStateAction<any>>;
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

let globalSetSentryAlertModal: null | ((modal: any) => void) = null;
let lastModalContent: any = null;
export const setGlobalSentryAlertModal = (modal: any) => {
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
  const [sentryAlertModal, setSentryAlertModal] = useState<any>(null);

  useEffect(() => {
    globalSetContactResponseModal = setContactResponseModal;
    globalSetSentryAlertModal = setSentryAlertModal;
  }, [setContactResponseModal, setSentryAlertModal]);

  // The value will be memoized and only re-created if the ref changes.
  const value = React.useMemo(() => ({ settingsSheetRef, contactResponseModal, setContactResponseModal, sentryAlertModal, setSentryAlertModal }), [settingsSheetRef, contactResponseModal, sentryAlertModal]);

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