import { createContext, ReactNode, useContext } from 'react';

interface LoginContextType {
  // Add any shared state here if needed in the future
}

const LoginContext = createContext<LoginContextType | null>(null);

export const LoginProvider = ({ children }: { children: ReactNode }) => {
  return (
    <LoginContext.Provider value={{}}>
      {children}
    </LoginContext.Provider>
  );
};

export const useLoginContext = () => {
  const context = useContext(LoginContext);
  if (!context) throw new Error('Cannot find LoginProvider');
  return context;
};
