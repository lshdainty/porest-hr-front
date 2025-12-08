import { ManagementContent } from '@/features/admin/users/management/components/ManagementContent';

import { ManagementProvider } from '@/features/admin/users/management/contexts/ManagementContext';

const UsersManagementPage = () => {
  return (
    <ManagementProvider>
      <ManagementContent />
    </ManagementProvider>
  );
};

export { UsersManagementPage };
