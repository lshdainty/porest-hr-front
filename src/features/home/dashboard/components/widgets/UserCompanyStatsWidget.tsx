import UserCompanyStatsItem, { getUserCompanyStatsConfig } from '@/features/admin/users/management/components/UserCompanyStatsItem';
import { GetUsersResp } from '@/lib/api/user';

interface UserCompanyStatsWidgetProps {
  users?: GetUsersResp[];
}

const UserCompanyStatsWidget = ({ users }: UserCompanyStatsWidgetProps) => {
  const companyStats = getUserCompanyStatsConfig(users);

  return (
    <div className='grid grid-cols-2 lg:grid-cols-5 gap-px bg-border h-full'>
      {companyStats.map((stat) => (
        <div key={stat.id} className='p-6 bg-card h-full'>
          <UserCompanyStatsItem {...stat} />
        </div>
      ))}
    </div>
  );
};

export default UserCompanyStatsWidget;
