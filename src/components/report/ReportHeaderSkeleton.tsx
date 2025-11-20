import { Skeleton } from '@/components/shadcn/skeleton';

export default function ReportHeaderSkeleton() {
  return (
    <>
      <Skeleton className='h-9 w-48 mb-6' />

      {/* 필터 및 액션 영역 */}
      <div className="mb-6 space-y-4">
        {/* 필터 토글 및 엑셀 버튼 영역 */}
        <div className="flex flex-wrap items-center gap-2">
          {/* 필터 버튼 스켈레톤 */}
          <Skeleton className="h-10 w-20" />

          {/* 구분선 */}
          <div className="h-8 w-px bg-border" />

          {/* 엑셀 관련 버튼들 스켈레톤 */}
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-40" />
        </div>
      </div>
    </>
  );
}
