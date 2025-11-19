import { useDeleteScheduleMutation } from '@/hooks/queries/useSchedules';
import { useDeleteVacationUsageMutation } from '@/hooks/queries/useVacations';
import type { IEvent } from '@/components/calendar/interfaces';

interface UseDeleteEventOptions {
  onSuccess?: () => void;
}

export const useDeleteEvent = () => {
  const { mutate: deleteVacation } = useDeleteVacationUsageMutation();
  const { mutate: deleteSchedule } = useDeleteScheduleMutation();

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
