import { ScheduleContent } from '@/features/work-schedule/ui/ScheduleContent';
import { ScheduleProvider } from '@/features/work-schedule/model/ScheduleContext';

const SchedulePage = () => {
  return (
    <ScheduleProvider>
      <ScheduleContent />
    </ScheduleProvider>
  );
};

export { SchedulePage };
