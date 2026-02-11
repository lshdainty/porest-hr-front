'use client';

import dayjs from 'dayjs';
import { createContext, useCallback, useContext, useState } from 'react';

import { usePermission } from '@/entities/session';
import { AddEventDialog } from '@/features/calendar/ui/dialogs/add-event-dialog';

interface DragSelectContextType {
  isSelecting: boolean;
  selectionStart: Date | null;
  selectionEnd: Date | null;
  startSelection: (date: Date) => void;
  updateSelection: (date: Date) => void;
  endSelection: () => void;
}

const DragSelectContext = createContext<DragSelectContextType | null>(null);

export const useDragSelect = () => {
  const context = useContext(DragSelectContext);
  if (!context) {
    throw new Error('useDragSelect must be used within a DragSelectProvider');
  }
  return context;
};

export const DragSelectProvider = ({ children }: { children: React.ReactNode }) => {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<Date | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<Date | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogDateRange, setDialogDateRange] = useState<{ start: Date; end: Date } | null>(null);

  const { hasAnyPermission } = usePermission();

  // 권한 체크: 둘 중 하나라도 있으면 일정 추가 가능
  const canAddEvent = hasAnyPermission(['VACATION:USE', 'VACATION:MANAGE', 'SCHEDULE:WRITE', 'SCHEDULE:MANAGE']);

  const startSelection = useCallback((date: Date) => {
    // 권한 없으면 드래그 선택 비활성화
    if (!canAddEvent) return;

    setIsSelecting(true);
    setSelectionStart(date);
    setSelectionEnd(date);
  }, [canAddEvent]);

  const updateSelection = useCallback((date: Date) => {
    if (isSelecting) {
      setSelectionEnd(date);
    }
  }, [isSelecting]);

  const endSelection = useCallback(() => {
    if (isSelecting && selectionStart && selectionEnd) {
      setIsSelecting(false);
      
      // Calculate actual start and end (handle reverse drag)
      const start = dayjs(selectionStart).isBefore(selectionEnd) ? selectionStart : selectionEnd;
      const end = dayjs(selectionStart).isBefore(selectionEnd) ? selectionEnd : selectionStart;

      setDialogDateRange({ start, end });
      setDialogOpen(true);
      
      // Reset selection state after a short delay or immediately?
      // Keeping them null clears the visual feedback immediately.
      setSelectionStart(null);
      setSelectionEnd(null);
    } else {
      setIsSelecting(false);
      setSelectionStart(null);
      setSelectionEnd(null);
    }
  }, [isSelecting, selectionStart, selectionEnd]);

  return (
    <DragSelectContext.Provider
      value={{
        isSelecting,
        selectionStart,
        selectionEnd,
        startSelection,
        updateSelection,
        endSelection,
      }}
    >
      {children}
      
      {dialogDateRange && (
        <AddEventDialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) {
              setDialogDateRange(null);
            }
          }}
          startDate={dialogDateRange.start}
          endDate={dialogDateRange.end}
        />
      )}
    </DragSelectContext.Provider>
  );
};
