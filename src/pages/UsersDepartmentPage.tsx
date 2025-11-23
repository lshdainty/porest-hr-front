import DepartmentContent from '@/features/admin/users/department/components/DepartmentContent';
import { DepartmentProvider } from '@/features/admin/users/department/contexts/DepartmentContext';

const UsersDepartmentPage = () => {
  return (
    <DepartmentProvider>
      <DepartmentContent />
    </DepartmentProvider>
  );
};

export default UsersDepartmentPage;
