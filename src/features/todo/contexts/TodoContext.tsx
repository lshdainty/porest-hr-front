import { createContext, ReactNode, useContext, useState } from 'react';

interface TodoContextType {
  filter: 'all' | 'completed';
  setFilter: (filter: 'all' | 'completed') => void;
}

const TodoContext = createContext<TodoContextType | null>(null);

export const TodoProvider = ({ children }: { children: ReactNode }) => {
  const [filter, setFilter] = useState<'all' | 'completed'>('all');

  return (
    <TodoContext.Provider value={{ filter, setFilter }}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodoContext = () => {
  const context = useContext(TodoContext);
  if (!context) throw new Error('Cannot find TodoProvider');
  return context;
};
