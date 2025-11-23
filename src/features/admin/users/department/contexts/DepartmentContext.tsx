import { createContext, ReactNode, useContext, useState } from 'react';

interface DepartmentContextType {
  selectedDept: any | null;
  setSelectedDept: (dept: any | null) => void;
}

const DepartmentContext = createContext<DepartmentContextType | null>(null);

export const DepartmentProvider = ({ children }: { children: ReactNode }) => {
  const [selectedDept, setSelectedDept] = useState<any | null>(null);

  return (
    <DepartmentContext.Provider value={{ selectedDept, setSelectedDept }}>
      {children}
    </DepartmentContext.Provider>
  );
};

export const useDepartmentContext = () => {
  const context = useContext(DepartmentContext);
  if (!context) throw new Error('Cannot find DepartmentProvider');
  return context;
};
