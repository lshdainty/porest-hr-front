import { Skeleton } from '@/components/shadcn/skeleton'

export const VacationTypeStatsSkeleton = () => {
  return (
    <div className="h-full w-full p-4 flex flex-col">
      {/* 차트 영역 */}
      <div className="flex-1 flex items-center justify-center">
        <div className="relative flex items-center justify-center">
          <Skeleton className="w-[180px] h-[180px] rounded-full" />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Skeleton className="h-8 w-16 mb-1" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
      </div>
      {/* 범례 영역 */}
      <div className="flex w-full items-center justify-center gap-2 pt-4 flex-wrap">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex items-center gap-1.5">
            <Skeleton className="h-2.5 w-2.5 rounded-full" />
            <Skeleton className="h-3 w-12" />
          </div>
        ))}
      </div>
    </div>
  )
}
