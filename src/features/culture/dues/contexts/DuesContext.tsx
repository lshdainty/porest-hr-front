import dayjs from 'dayjs';
import { createContext, ReactNode, useContext } from 'react';

interface DuesContextType {
  year: number;
  month: number;
}

const DuesContext = createContext<DuesContextType | null>(null);

export const DuesProvider = ({ children }: { children: ReactNode }) => {
  const year = dayjs().year();
  const month = dayjs().month() + 1;

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
