import { createContext, ReactNode, useContext, useState } from 'react';

interface CompanyContextType {
  selectedDept: any | null;
  setSelectedDept: (dept: any | null) => void;
  isCompanyEditDialogOpen: boolean;
  setIsCompanyEditDialogOpen: (isOpen: boolean) => void;
}

const CompanyContext = createContext<CompanyContextType | null>(null);

export const CompanyProvider = ({ children }: { children: ReactNode }) => {
  const [selectedDept, setSelectedDept] = useState<any | null>(null);
  const [isCompanyEditDialogOpen, setIsCompanyEditDialogOpen] = useState(false);

  return (
    <CompanyContext.Provider value={{ selectedDept, setSelectedDept, isCompanyEditDialogOpen, setIsCompanyEditDialogOpen }}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompanyContext = () => {
  const context = useContext(CompanyContext);
  if (!context) throw new Error('Cannot find CompanyProvider');
  return context;
};
