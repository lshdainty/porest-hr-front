import UserInfoCardSkeleton from '@/features/user/components/UserInfoCardSkeleton';
import UserInfoContent from '@/features/user/components/UserInfoContent';
import { GetUserResp } from '@/lib/api/user';

interface ProfileWidgetProps {
  user?: GetUserResp;
}

const ProfileWidget = ({ user }: ProfileWidgetProps) => {
  if (!user) {
    return <UserInfoCardSkeleton />;
  }

  return (
    <div className='h-full overflow-y-auto'>
      <UserInfoContent user={user} />
    </div>
  );
};

export default ProfileWidget;
