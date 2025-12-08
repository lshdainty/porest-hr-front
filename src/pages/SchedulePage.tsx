import { ScheduleContent } from '@/features/work/schedule/components/ScheduleContent';
import { ScheduleProvider } from '@/features/work/schedule/contexts/ScheduleContext';

const SchedulePage = () => {
  return (
    <ScheduleProvider>
      <ScheduleContent />
    </ScheduleProvider>
  );
};

export { SchedulePage }
