import { useDeleteSchedule } from '@/api/schedule';
import { useDeleteVacationUsage } from '@/api/vacation';
import type { IEvent } from '@/components/calendar/interfaces';

interface UseDeleteEventOptions {
  onSuccess?: () => void;
}

export const useDeleteEvent = () => {
  const { mutate: deleteVacation } = useDeleteVacationUsage();
  const { mutate: deleteSchedule } = useDeleteSchedule();

  const deleteEvent = (event: IEvent, options?: UseDeleteEventOptions) => {
    const isVacation = event.type.type === 'vacation';

    if (isVacation) {
      deleteVacation(event.id, {
        onSuccess: options?.onSuccess
      });
    } else {
      deleteSchedule(event.id, {
        onSuccess: options?.onSuccess
      });
    }
  };

  return { deleteEvent };
};
