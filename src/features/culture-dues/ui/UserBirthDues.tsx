import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/shadcn/card';
import { GetUsersMonthBirthDuesResp } from '@/entities/dues';
import { GetUsersResp } from '@/entities/user';
import { useTranslation } from 'react-i18next';
import { UserBirthDuesContent } from '@/features/culture-dues/ui/UserBirthDuesContent';

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

export { UserBirthDues };