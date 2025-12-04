import QueryAsyncBoundary from '@/components/common/QueryAsyncBoundary';
import { UserNoticeContent } from '@/features/home/notice/components/UserNoticeContent';
import { UserNoticeSkeleton } from '@/features/home/notice/components/UserNoticeSkeleton';
import { useActiveNoticesQuery } from '@/hooks/queries/useNotices';

const UserNoticePage = () => {
  const { isLoading, error, data } = useActiveNoticesQuery(0, 10);

  return (
    <QueryAsyncBoundary
      queryState={{ isLoading, error, data }}
      loadingComponent={<UserNoticeSkeleton />}
      errorComponent={
        <div className="p-4 sm:p-6 md:p-8">
          <div className="p-8 text-center text-red-600">
            데이터를 불러오는데 실패했습니다.
          </div>
        </div>
      }
    >
      <UserNoticeContent />
    </QueryAsyncBoundary>
  );
};

export default UserNoticePage;
