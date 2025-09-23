'use client';

import { createContext, useContext, useState, useMemo, ReactNode } from 'react';

type DeviceView = 'desktop' | 'mobile';

type DeviceViewContextType = {
  view: DeviceView;
  setView: (view: DeviceView) => void;
};

const DeviceViewContext = createContext<DeviceViewContextType | null>(null);

export function DeviceViewProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<DeviceView>('desktop');

  const value = useMemo(() => ({ view, setView }), [view]);

  return (
    <DeviceViewContext.Provider value={value}>
      {children}
    </DeviceViewContext.Provider>
  );
}

export function useDeviceView() {
  const context = useContext(DeviceViewContext);
  if (!context) {
    throw new Error('useDeviceView must be used within a DeviceViewProvider');
  }
  return context;
}
