import { HolidayContent } from '@/features/admin-holiday/ui/HolidayContent';
import { HolidayProvider } from '@/features/admin-holiday/model/HolidayContext';

const HolidayPage = () => {
  return (
    <HolidayProvider>
      <HolidayContent />
    </HolidayProvider>
  );
};

export { HolidayPage };
