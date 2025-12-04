import { NoticeListResp } from '@/lib/api/notice';
import { createContext, ReactNode, useContext, useState } from 'react';

interface NoticeContextType {
  isDialogOpen: boolean;
  setIsDialogOpen: (isOpen: boolean) => void;
  editingNotice: NoticeListResp | null;
  setEditingNotice: (notice: NoticeListResp | null) => void;
}

const NoticeContext = createContext<NoticeContextType | null>(null);

export const NoticeProvider = ({ children }: { children: ReactNode }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<NoticeListResp | null>(null);

  return (
    <NoticeContext.Provider value={{ isDialogOpen, setIsDialogOpen, editingNotice, setEditingNotice }}>
      {children}
    </NoticeContext.Provider>
  );
};

export const useNoticeContext = () => {
  const context = useContext(NoticeContext);
  if (!context) throw new Error('Cannot find NoticeProvider');
  return context;
};
