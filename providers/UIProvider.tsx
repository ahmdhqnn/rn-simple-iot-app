import React, { createContext, PropsWithChildren, useContext, useState } from "react";

type UIContextType = {
  tabBarHidden: boolean;
  setTabBarHidden: (v: boolean) => void;
};

const UIContext = createContext<UIContextType | null>(null);

export function UIProvider({ children }: PropsWithChildren) {
  const [tabBarHidden, setTabBarHidden] = useState(false);
  return (
    <UIContext.Provider value={{ tabBarHidden, setTabBarHidden }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used within UIProvider");
  return ctx;
}
