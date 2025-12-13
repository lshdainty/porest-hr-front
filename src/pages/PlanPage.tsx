import { PlanContent } from '@/features/admin/vacation/plan/components/PlanContent';
import { PlanProvider } from '@/features/admin/vacation/plan/contexts/PlanContext';

const PlanPage = () => {
  return (
    <PlanProvider>
      <PlanContent />
    </PlanProvider>
  );
};

export { PlanPage };
