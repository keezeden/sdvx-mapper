"use client";
import React, { createContext, useState, ReactNode, useContext } from "react";

type AppContextType = {
  bpm: number;
  sound: Howl | null;
  tool: "BT" | "FX" | "RL" | "LL";
};

type AppContextProps = {
  setAppContext: (newContext: Partial<AppContextType>) => void;
} & AppContextType;

const AppContext = createContext<AppContextProps | undefined>(undefined);

const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [appContext, setAppContext] = useState<AppContextType>({
    bpm: 180,
    tool: "BT",
    sound: null,
  });

  const updateAppContext = (newContext: Partial<AppContextType>) => {
    setAppContext({ ...appContext, ...newContext });
  };

  const state = {
    ...appContext,
    setAppContext: updateAppContext,
  };

  return <AppContext.Provider value={state}>{children}</AppContext.Provider>;
};

const useAppContext = (): AppContextProps => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

export { AppProvider, AppContext, useAppContext };
