import UserCompanyStatsItem, { getUserCompanyStatsConfig } from '@/features/admin/users/management/components/UserCompanyStatsItem';
import { GetUsersResp } from '@/lib/api/user';

interface UserCompanyStatsWidgetProps {
  users?: GetUsersResp[];
}

const UserCompanyStatsWidget = ({ users }: UserCompanyStatsWidgetProps) => {
  const companyStats = getUserCompanyStatsConfig(users);

  return (
    <div className='grid grid-cols-1 lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-border h-full bg-card'>
      {companyStats.map((stat) => (
        <div key={stat.id} className='p-6 h-full'>
          <UserCompanyStatsItem {...stat} />
        </div>
      ))}
    </div>
  );
};

export default UserCompanyStatsWidget;
