import { PlanContent } from '@/features/admin-vacation-plan/ui/PlanContent';
import { PlanProvider } from '@/features/admin-vacation-plan/model/PlanContext';

const PlanPage = () => {
  return (
    <PlanProvider>
      <PlanContent />
    </PlanProvider>
  );
};

export { PlanPage };
