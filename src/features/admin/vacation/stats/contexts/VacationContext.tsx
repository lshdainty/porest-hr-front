import { createContext, ReactNode, useContext, useState } from 'react';

interface VacationContextType {
  selectedUserId: string;
  setSelectedUserId: (id: string) => void;
}

const VacationContext = createContext<VacationContextType | null>(null);

export const VacationProvider = ({ children }: { children: ReactNode }) => {
  const [selectedUserId, setSelectedUserId] = useState<string>('');

  return (
    <VacationContext.Provider value={{ selectedUserId, setSelectedUserId }}>
      {children}
    </VacationContext.Provider>
  );
};

export const useVacationContext = () => {
  const context = useContext(VacationContext);
  if (!context) throw new Error('Cannot find VacationProvider');
  return context;
};
