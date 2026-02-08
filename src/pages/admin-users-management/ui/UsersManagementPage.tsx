import { ManagementContent } from '@/features/admin-users-management/ui/ManagementContent';

import { ManagementProvider } from '@/features/admin-users-management/model/ManagementContext';

const UsersManagementPage = () => {
  return (
    <ManagementProvider>
      <ManagementContent />
    </ManagementProvider>
  );
};

export { UsersManagementPage };
