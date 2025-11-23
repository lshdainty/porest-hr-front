import dayjs from 'dayjs';
import { createContext, ReactNode, useContext } from 'react';

interface DuesContextType {
  year: string;
  month: string;
}

const DuesContext = createContext<DuesContextType | null>(null);

export const DuesProvider = ({ children }: { children: ReactNode }) => {
  const year = dayjs().format('YYYY');
  const month = dayjs().format('MM');

  return (
    <DuesContext.Provider value={{ year, month }}>
      {children}
    </DuesContext.Provider>
  );
};

export const useDuesContext = () => {
  const context = useContext(DuesContext);
  if (!context) throw new Error('Cannot find DuesProvider');
  return context;
};
