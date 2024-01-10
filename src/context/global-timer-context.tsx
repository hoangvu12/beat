import { Timer } from "@/types/core";
import { createContext, useContext, useState } from "react";

export const GlobalTimerContext = createContext<{
  timer: Timer | null;
  setTimer: (timer: Timer | null) => void;
}>(null as any);

export const GlobalTimerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [timer, setTimer] = useState<Timer | null>(null as any);

  return (
    <GlobalTimerContext.Provider value={{ timer, setTimer }}>
      {children}
    </GlobalTimerContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useGlobalTimer = () => {
  const data = useContext(GlobalTimerContext);

  if (!data) throw new Error("GlobalTimerContext not found");

  return data;
};
