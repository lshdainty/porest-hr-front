import { createContext, ReactNode, useContext, useState } from 'react';

interface PolicyContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const PolicyContext = createContext<PolicyContextType | null>(null);

export const PolicyProvider = ({ children }: { children: ReactNode }) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <PolicyContext.Provider value={{ searchQuery, setSearchQuery }}>
      {children}
    </PolicyContext.Provider>
  );
};

export const usePolicyContext = () => {
  const context = useContext(PolicyContext);
  if (!context) throw new Error('Cannot find PolicyProvider');
  return context;
};
