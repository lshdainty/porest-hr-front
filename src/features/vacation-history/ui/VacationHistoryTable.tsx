import { Button } from '@/shared/ui/shadcn/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/shadcn/card';
import { usePermission } from '@/entities/session';
import { AddEventDialog } from '@/features/calendar/ui/dialogs/add-event-dialog';
import { EditEventDialog } from '@/features/calendar/ui/dialogs/edit-event-dialog';
import { IEvent } from '@/features/calendar/model/interfaces';
import { calendarTypes } from '@/features/calendar/model/types';
import { useDeleteVacationUsageMutation } from '@/entities/vacation';
import { type GetUserVacationHistoryResp } from '@/entities/vacation';
import { Activity, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { VacationHistoryContent } from './VacationHistoryContent'

interface VacationHistoryTableProps {
  value: GetUserVacationHistoryResp;
  canAdd?: boolean;
}

const VacationHistoryTable = ({ value: data, canAdd = false }: VacationHistoryTableProps) => {
  const { t } = useTranslation('vacation');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null);

  const { mutate: deleteVacationUsage } = useDeleteVacationUsageMutation();
  const { hasAnyPermission } = usePermission();

  // 권한 체크: 둘 중 하나라도 있으면 일정 추가 가능
  const canAddEvent = hasAnyPermission(['VACATION:USE', 'VACATION:MANAGE', 'SCHEDULE:WRITE', 'SCHEDULE:MANAGE']);

  const handleAddVacation = () => {
    setAddDialogOpen(true);
  };

  const handleEdit = (item: any) => {
    // IEvent 형태로 변환
    const event: IEvent = {
      id: item.vacation_usage_id,
      type: calendarTypes.find(c => c.type === 'vacation') || calendarTypes[0], // 기본값 설정
      title: item.vacation_usage_desc,
      description: item.vacation_usage_desc,
      startDate: item.start_date,
      endDate: item.end_date,
      vacationType: item.vacation_time_type,
      user: { id: '', name: '', picturePath: null } // 필수 필드 채움 (실제로는 사용되지 않음)
    };
    setSelectedEvent(event);
    setEditDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm(t('history.deleteConfirm'))) {
      deleteVacationUsage(id);
    }
  };

  return (
    <>
      <Card className='flex-1'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle>{t('history.vacationHistory')}</CardTitle>
            <Activity mode={canAdd && canAddEvent ? 'visible' : 'hidden'}>
              <div className='flex gap-2'>
                <Button className='text-sm h-8' size='sm' onClick={handleAddVacation}>{t('history.useVacation')}</Button>
              </div>
            </Activity>
          </div>
        </CardHeader>
        <CardContent>
          <VacationHistoryContent 
            data={data} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
          />
        </CardContent>
      </Card>
      <AddEventDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />
      {selectedEvent && (
        <EditEventDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          event={selectedEvent}
        >
          <></>
        </EditEventDialog>
      )}
    </>
  )
}

export { VacationHistoryTable }