import { useUser } from '@/contexts/UserContext';
import DashboardContent from '@/features/home/dashboard/components/DashboardContent';
import { DashboardProvider } from '@/features/home/dashboard/contexts/DashboardContext';
import { useUserQuery } from '@/hooks/queries/useUsers';

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
