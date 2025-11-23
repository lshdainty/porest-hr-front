import { createContext, ReactNode, useContext, useState } from 'react';

interface ApplicationContextType {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
}

const ApplicationContext = createContext<ApplicationContextType | null>(null);

export const ApplicationProvider = ({ children }: { children: ReactNode }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <ApplicationContext.Provider value={{ isDialogOpen, setIsDialogOpen }}>
      {children}
    </ApplicationContext.Provider>
  );
};

export const useApplicationContext = () => {
  const context = useContext(ApplicationContext);
  if (!context) throw new Error('Cannot find ApplicationProvider');
  return context;
};
