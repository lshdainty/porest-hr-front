import { GetHolidaysResp } from '@/entities/holiday';
import { createContext, ReactNode, useContext, useState } from 'react';

interface HolidayContextType {
  isDialogOpen: boolean;
  setIsDialogOpen: (isOpen: boolean) => void;
  editingHoliday: GetHolidaysResp | null;
  setEditingHoliday: (holiday: GetHolidaysResp | null) => void;
}

const HolidayContext = createContext<HolidayContextType | null>(null);

export const HolidayProvider = ({ children }: { children: ReactNode }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<GetHolidaysResp | null>(null);

  return (
    <HolidayContext.Provider value={{ isDialogOpen, setIsDialogOpen, editingHoliday, setEditingHoliday }}>
      {children}
    </HolidayContext.Provider>
  );
};

export const useHolidayContext = () => {
  const context = useContext(HolidayContext);
  if (!context) throw new Error('Cannot find HolidayProvider');
  return context;
};
