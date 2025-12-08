import { VacationContent } from '@/features/admin/vacation/stats/components/VacationContent';
import { VacationProvider } from '@/features/admin/vacation/stats/contexts/VacationContext';

const VacationPage = () => {
  return (
    <VacationProvider>
      <VacationContent />
    </VacationProvider>
  );
};

export { VacationPage };
