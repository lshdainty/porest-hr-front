import { createContext, ReactNode, useContext, useState } from 'react';

interface ApplicationContextType {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  selectedYear: string;
  setSelectedYear: (year: string) => void;
}

const ApplicationContext = createContext<ApplicationContextType | null>(null);

export const ApplicationProvider = ({ children }: { children: ReactNode }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

  return (
    <ApplicationContext.Provider value={{ isDialogOpen, setIsDialogOpen, selectedYear, setSelectedYear }}>
      {children}
    </ApplicationContext.Provider>
  );
};

export const useApplicationContext = () => {
  const context = useContext(ApplicationContext);
  if (!context) throw new Error('Cannot find ApplicationProvider');
  return context;
};
