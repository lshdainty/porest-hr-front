import QueryAsyncBoundary from "@/components/common/QueryAsyncBoundary";
import ScheduleSkeleton from "@/components/schedule/ScheduleSkeleton";
import ScheduleTable from "@/components/schedule/ScheduleTable";
import { useUsersQuery } from "@/hooks/queries/useUsers";
import { GetUsersResp } from "@/lib/api/user";

interface ScheduleContentProps {
  users: GetUsersResp[];
}

const ScheduleContent = ({ users }: ScheduleContentProps) => {
  return (
    <ScheduleTable users={users} />
  );
};

export default function Schedule() {
  const { data: users, isLoading, error } = useUsersQuery();

  return (
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
      <ScheduleContent users={users || []} />
    </QueryAsyncBoundary>
  );
}
