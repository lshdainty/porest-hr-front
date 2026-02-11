import { VacationContent } from '@/features/admin-vacation-approval/ui/VacationContent';
import { VacationProvider } from '@/features/admin-vacation-approval/model/VacationContext';

const VacationPage = () => {
  return (
    <VacationProvider>
      <VacationContent />
    </VacationProvider>
  );
};

export { VacationPage };
