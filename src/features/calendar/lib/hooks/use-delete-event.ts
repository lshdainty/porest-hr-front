import { useDeleteScheduleMutation } from '@/entities/schedule';
import { useDeleteVacationUsageMutation } from '@/entities/vacation';
import type { IEvent } from '@/features/calendar/model/interfaces';

interface UseDeleteEventOptions {
  onSuccess?: () => void;
}

export const useDeleteEvent = () => {
  const { mutate: deleteVacation, isPending: isVacationPending } = useDeleteVacationUsageMutation();
  const { mutate: deleteSchedule, isPending: isSchedulePending } = useDeleteScheduleMutation();

  const isPending = isVacationPending || isSchedulePending;

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

  return { deleteEvent, isPending };
};
