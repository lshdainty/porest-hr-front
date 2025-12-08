import QueryAsyncBoundary from "@/components/common/QueryAsyncBoundary";
import { ScheduleHeader } from "@/features/work/schedule/components/ScheduleHeader";
import { ScheduleSkeleton } from "@/features/work/schedule/components/ScheduleSkeleton";
import { ScheduleTable } from "@/features/work/schedule/components/ScheduleTable";
import { useUsersQuery } from "@/hooks/queries/useUsers";

const ScheduleContent = () => {
  const { data: users, isLoading, error } = useUsersQuery();

  return (
    <div className='p-4 sm:p-6 md:p-8'>
      <ScheduleHeader />
      <QueryAsyncBoundary
        queryState={{ isLoading, error, data: users }}
        loadingComponent={<ScheduleSkeleton />}
        errorComponent={
          <div className='p-4 sm:p-6 md:p-8'>
            <div className='p-8 text-center text-red-600'>
              데이터를 불러오는데 실패했습니다.
            </div>
          </div>
        }
      >
        <ScheduleTable users={users || []} />
      </QueryAsyncBoundary>
    </div>
  );
};

export { ScheduleContent }
