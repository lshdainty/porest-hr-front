import { Card, CardContent } from '@/components/shadcn/card';
import { GetUsersResp } from '@/lib/api/user';
import UserCompanyStatsItem, { getUserCompanyStatsConfig } from './UserCompanyStatsItem';

interface UserCompanyCardProps {
  value: GetUsersResp[];
}

const UserCompanyCard = ({ value: users }: UserCompanyCardProps) => {
  const companyStats = getUserCompanyStatsConfig(users);

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-6'>
      {companyStats.map((stat) => (
        <Card key={stat.id}>
          <CardContent className='p-6 h-full'>
            <UserCompanyStatsItem {...stat} />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default UserCompanyCard