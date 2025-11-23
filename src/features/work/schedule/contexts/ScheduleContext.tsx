import { createContext, ReactNode, useContext } from 'react';

interface ScheduleContextType {
  // Add future UI state here
}

const ScheduleContext = createContext<ScheduleContextType | null>(null);

export const ScheduleProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ScheduleContext.Provider value={{}}>
      {children}
    </ScheduleContext.Provider>
  );
};

export const useScheduleContext = () => {
  const context = useContext(ScheduleContext);
  if (!context) throw new Error('Cannot find ScheduleProvider');
  return context;
};
