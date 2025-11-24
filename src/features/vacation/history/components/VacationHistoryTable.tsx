import { Button } from '@/components/shadcn/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card';
import { AddEventDialog } from '@/features/home/calendar/components/dialogs/add-event-dialog';
import { EditEventDialog } from '@/features/home/calendar/components/dialogs/edit-event-dialog';
import { IEvent } from '@/features/home/calendar/interfaces';
import { calendarTypes } from '@/features/home/calendar/types';
import { useDeleteVacationUsageMutation } from '@/hooks/queries/useVacations';
import { GetUserVacationHistoryResp } from '@/lib/api/vacation';
import { useState } from 'react';
import VacationHistoryContent from './VacationHistoryContent';

interface VacationHistoryTableProps {
  value: GetUserVacationHistoryResp;
  canAdd?: boolean;
}

const VacationHistoryTable = ({ value: data, canAdd = false }: VacationHistoryTableProps) => {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null);

  const { mutate: deleteVacationUsage } = useDeleteVacationUsageMutation();

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
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      deleteVacationUsage(id);
    }
  };

  return (
    <>
      <Card className='flex-1'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle>휴가 이력</CardTitle>
            {canAdd && (
              <div className='flex gap-2'>
                <Button className='text-sm h-8' size='sm' onClick={handleAddVacation}>휴가 사용</Button>
              </div>
            )}
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

export default VacationHistoryTable