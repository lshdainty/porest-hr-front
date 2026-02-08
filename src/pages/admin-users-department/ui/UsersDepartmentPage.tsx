import { DepartmentContent } from '@/features/admin-users-department/ui/DepartmentContent';
import { DepartmentProvider } from '@/features/admin-users-department/model/DepartmentContext';

const UsersDepartmentPage = () => {
  return (
    <DepartmentProvider>
      <DepartmentContent />
    </DepartmentProvider>
  );
};

export { UsersDepartmentPage };
