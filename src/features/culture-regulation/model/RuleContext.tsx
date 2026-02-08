import { createContext, ReactNode, useContext } from 'react';

interface RuleContextType {
  // Add future state here
}

const RuleContext = createContext<RuleContextType | null>(null);

export const RuleProvider = ({ children }: { children: ReactNode }) => {
  return (
    <RuleContext.Provider value={{}}>
      {children}
    </RuleContext.Provider>
  );
};

export const useRuleContext = () => {
  const context = useContext(RuleContext);
  if (!context) throw new Error('Cannot find RuleProvider');
  return context;
};
