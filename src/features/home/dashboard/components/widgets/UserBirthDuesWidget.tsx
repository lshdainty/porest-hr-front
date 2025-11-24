import UserBirthDuesContent from '@/features/culture/dues/components/UserBirthDuesContent';
import { GetUsersMonthBirthDuesResp } from '@/lib/api/dues';
import { GetUsersResp } from '@/lib/api/user';

interface UserBirthDuesWidgetProps {
  usersBirthDues?: GetUsersMonthBirthDuesResp[];
  users?: GetUsersResp[];
}

const UserBirthDuesWidget = ({ usersBirthDues, users }: UserBirthDuesWidgetProps) => {
  return (
    <div className='h-full w-full p-4 overflow-auto'>
      <UserBirthDuesContent usersBirthDues={usersBirthDues} users={users} />
    </div>
  );
};

export default UserBirthDuesWidget;
