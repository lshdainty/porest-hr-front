import { Skeleton } from '@/components/shadcn/skeleton';
import { VacationPolicyListsSkeleton } from './VacationPolicyListsSkeleton';

const PolicyContentSkeleton = () => {
  return (
    <div className='p-4 sm:p-6 md:p-8'>
      <div className="flex flex-col gap-7">
        {/* 헤더 영역 */}
        <div className="flex flex-col gap-2">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-64" />
        </div>

        {/* 검색 및 리스트 영역 */}
        <div className="flex flex-col gap-4">
          {/* 검색 영역 */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
              <Skeleton className="h-10 w-full sm:w-80" />
              <Skeleton className="h-5 w-24" />
            </div>
            <Skeleton className="h-10 w-full sm:w-32" />
          </div>

          {/* 정책 리스트 */}
          <VacationPolicyListsSkeleton />
        </div>
      </div>
    </div>
  );
};

export default PolicyContentSkeleton;
