import { Skeleton } from '@/components/shadcn/skeleton';

const ScheduleHeaderSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 mb-6">
      <Skeleton className="h-9 w-48" />
    </div>
  );
};

export default ScheduleHeaderSkeleton;
