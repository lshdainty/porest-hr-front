import { WorkCodeResp } from '@/entities/work';
import { createContext, ReactNode, useContext, useState } from 'react';

interface WorkCodeContextType {
  isDialogOpen: boolean;
  setIsDialogOpen: (isOpen: boolean) => void;
  editingWorkCode: WorkCodeResp | null;
  setEditingWorkCode: (workCode: WorkCodeResp | null) => void;
}

const WorkCodeContext = createContext<WorkCodeContextType | null>(null);

export const WorkCodeProvider = ({ children }: { children: ReactNode }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWorkCode, setEditingWorkCode] = useState<WorkCodeResp | null>(null);

  return (
    <WorkCodeContext.Provider value={{ isDialogOpen, setIsDialogOpen, editingWorkCode, setEditingWorkCode }}>
      {children}
    </WorkCodeContext.Provider>
  );
};

export const useWorkCodeContext = () => {
  const context = useContext(WorkCodeContext);
  if (!context) throw new Error('Cannot find WorkCodeProvider');
  return context;
};
