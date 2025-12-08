import QueryAsyncBoundary from '@/components/common/QueryAsyncBoundary';
import { useUser } from '@/contexts/UserContext';
import EmptyProfile from '@/features/user/components/EmptyProfile';
import UserInfoCardSkeleton from '@/features/user/components/UserInfoCardSkeleton';
import UserInfoContent from '@/features/user/components/UserInfoContent';
import { useUserQuery } from '@/hooks/queries/useUsers';

export const ProfileWidget = () => {
  const { loginUser } = useUser();
  const userId = loginUser?.user_id || '';

  const { data: user, isLoading, error } = useUserQuery(userId);

  return (
    <QueryAsyncBoundary
      queryState={{ isLoading, error, data: user }}
      loadingComponent={<UserInfoCardSkeleton />}
      emptyComponent={<EmptyProfile className="h-full" />}
      isEmpty={(data) => !data}
    >
      <div className='h-full overflow-y-auto'>
        <UserInfoContent user={user!} />
      </div>
    </QueryAsyncBoundary>
  );
}
