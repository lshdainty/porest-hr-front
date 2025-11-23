import { createContext, ReactNode, useContext, useState } from 'react';

interface HistoryContextType {
  selectedYear: string;
  setSelectedYear: (year: string) => void;
}

const HistoryContext = createContext<HistoryContextType | null>(null);

export const HistoryProvider = ({ children }: { children: ReactNode }) => {
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());

  return (
    <HistoryContext.Provider value={{ selectedYear, setSelectedYear }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistoryContext = () => {
  const context = useContext(HistoryContext);
  if (!context) throw new Error('Cannot find HistoryProvider');
  return context;
};
