import React, { createContext, useContext, useRef, RefObject } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';

type AppContextType = {
  settingsSheetRef: RefObject<BottomSheet>;
};

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const settingsSheetRef = useRef<BottomSheet>(null);

  // The value will be memoized and only re-created if the ref changes.
  const value = React.useMemo(() => ({ settingsSheetRef }), [settingsSheetRef]);

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