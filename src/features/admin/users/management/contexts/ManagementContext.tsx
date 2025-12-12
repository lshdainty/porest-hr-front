import { createContext, ReactNode, useContext, useState } from 'react';

interface ManagementContextType {
  showInviteDialog: boolean;
  setShowInviteDialog: (show: boolean) => void;
  showEditDialog: string | null;
  setShowEditDialog: (id: string | null) => void;
  showResendDialog: string | null;
  setShowResendDialog: (id: string | null) => void;
  showPlanDialog: string | null;
  setPlanDialog: (id: string | null) => void;
  showDeleteDialog: string | null;
  setShowDeleteDialog: (id: string | null) => void;
  showInviteEditDialog: string | null;
  setShowInviteEditDialog: (id: string | null) => void;
}

const ManagementContext = createContext<ManagementContextType | null>(null);

export const ManagementProvider = ({ children }: { children: ReactNode }) => {
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState<string | null>(null);
  const [showResendDialog, setShowResendDialog] = useState<string | null>(null);
  const [showPlanDialog, setPlanDialog] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState<string | null>(null);
  const [showInviteEditDialog, setShowInviteEditDialog] = useState<string | null>(null);

  return (
    <ManagementContext.Provider
      value={{
        showInviteDialog,
        setShowInviteDialog,
        showEditDialog,
        setShowEditDialog,
        showResendDialog,
        setShowResendDialog,
        showPlanDialog,
        setPlanDialog,
        showDeleteDialog,
        setShowDeleteDialog,
        showInviteEditDialog,
        setShowInviteEditDialog
      }}
    >
      {children}
    </ManagementContext.Provider>
  );
};

export const useManagementContext = () => {
  const context = useContext(ManagementContext);
  if (!context) throw new Error('Cannot find ManagementProvider');
  return context;
};
