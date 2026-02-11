import { createContext, ReactNode, useContext, useState } from 'react';

interface PlanContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const PlanContext = createContext<PlanContextType | null>(null);

export const PlanProvider = ({ children }: { children: ReactNode }) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <PlanContext.Provider value={{ searchQuery, setSearchQuery }}>
      {children}
    </PlanContext.Provider>
  );
};

export const usePlanContext = () => {
  const context = useContext(PlanContext);
  if (!context) throw new Error('Cannot find PlanProvider');
  return context;
};
