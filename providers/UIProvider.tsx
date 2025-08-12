import React, { createContext, PropsWithChildren, useContext, useState } from "react";

type UIContextType = {
  tabBarHidden: boolean;
  setTabBarHidden: (v: boolean) => void;
  sheetProgress: number;                 // 0..1  (0=closed, 1=expanded)
  setSheetProgress: (v: number) => void;
};

const UIContext = createContext<UIContextType | null>(null);

export function UIProvider({ children }: PropsWithChildren) {
  const [tabBarHidden, setTabBarHidden] = useState(false);
  const [sheetProgress, setSheetProgress] = useState(0);
  return (
    <UIContext.Provider value={{ tabBarHidden, setTabBarHidden, sheetProgress, setSheetProgress }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used within UIProvider");
  return ctx;
}
