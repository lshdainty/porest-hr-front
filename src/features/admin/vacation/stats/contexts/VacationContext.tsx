import { createContext, ReactNode, useContext, useState } from 'react';

interface VacationContextType {
  selectedUserId: string;
  setSelectedUserId: (id: string) => void;
  selectedYear: string;
  setSelectedYear: (year: string) => void;
}

const VacationContext = createContext<VacationContextType | null>(null);

export const VacationProvider = ({ children }: { children: ReactNode }) => {
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());

  return (
    <VacationContext.Provider value={{ selectedUserId, setSelectedUserId, selectedYear, setSelectedYear }}>
      {children}
    </VacationContext.Provider>
  );
};

export const useVacationContext = () => {
  const context = useContext(VacationContext);
  if (!context) throw new Error('Cannot find VacationProvider');
  return context;
};
