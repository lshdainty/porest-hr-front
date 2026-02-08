import { useUser } from '@/entities/session';
import DashboardContent from '@/features/dashboard/ui/DashboardContent';
import { DashboardProvider } from '@/features/dashboard/model/DashboardContext';
import { useUserQuery } from '@/entities/user';

const DashboardPage = () => {
  const { loginUser } = useUser();
  const user_id = loginUser?.user_id || '';

  const { data: user } = useUserQuery(user_id);

  return (
    <DashboardProvider userId={user_id} initialDashboard={user?.dashboard}>
      <DashboardContent />
    </DashboardProvider>
  );
};

export { DashboardPage };
