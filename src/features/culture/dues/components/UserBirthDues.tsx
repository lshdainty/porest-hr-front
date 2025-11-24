import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card';
import { GetUsersMonthBirthDuesResp } from '@/lib/api/dues';
import { GetUsersResp } from '@/lib/api/user';
import UserBirthDuesContent from './UserBirthDuesContent';

interface UserBirthDuesProps {
  usersBirthDues?: GetUsersMonthBirthDuesResp[];
  users?: GetUsersResp[];
}

const UserBirthDues = ({ usersBirthDues, users }: UserBirthDuesProps) => {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>월별 생일비 입금 현황</CardTitle>
        </CardHeader>
        <CardContent>
          <UserBirthDuesContent usersBirthDues={usersBirthDues} users={users} />
        </CardContent>
      </Card>
    </div>
  );
};

export default UserBirthDues;