import HolidayContent from '@/features/admin/holiday/components/HolidayContent';
import { HolidayProvider } from '@/features/admin/holiday/contexts/HolidayContext';

const HolidayPage = () => {
  return (
    <HolidayProvider>
      <HolidayContent />
    </HolidayProvider>
  );
};

export default HolidayPage;
