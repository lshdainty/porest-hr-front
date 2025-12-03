import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card';
import { GetUsersMonthBirthDuesResp } from '@/lib/api/dues';
import { GetUsersResp } from '@/lib/api/user';
import { useTranslation } from 'react-i18next';
import UserBirthDuesContent from './UserBirthDuesContent';

interface UserBirthDuesProps {
  usersBirthDues?: GetUsersMonthBirthDuesResp[];
  users?: GetUsersResp[];
}

const UserBirthDues = ({ usersBirthDues, users }: UserBirthDuesProps) => {
  const { t } = useTranslation('culture');

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>{t('dues.monthBirthDuesTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <UserBirthDuesContent usersBirthDues={usersBirthDues} users={users} />
        </CardContent>
      </Card>
    </div>
  );
};

export default UserBirthDues;