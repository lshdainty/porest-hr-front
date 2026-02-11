import QueryAsyncBoundary from '@/shared/ui/async-boundary/QueryAsyncBoundary';
import { useUser } from '@/entities/session';
import { EmptyProfile } from '@/features/user-profile/ui/EmptyProfile';
import { UserInfoCardSkeleton } from '@/features/user-profile/ui/UserInfoCardSkeleton';
import { UserInfoContent } from '@/features/user-profile/ui/UserInfoContent';
import { useUserQuery } from '@/entities/user';

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
