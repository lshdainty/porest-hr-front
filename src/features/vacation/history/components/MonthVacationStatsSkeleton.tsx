import { Skeleton } from '@/components/shadcn/skeleton'

export const MonthVacationStatsSkeleton = () => {
  // 12개월 바 높이 (랜덤하게 보이도록 다양한 높이 설정)
  const barHeights = [60, 80, 45, 70, 90, 55, 75, 85, 50, 65, 40, 95]

  return (
    <div className="h-full w-full p-4 flex flex-col">
      {/* 차트 영역 */}
      <div className="flex-1 flex items-end gap-2 pb-6 pt-2">
        {barHeights.map((height, index) => (
          <div key={index} className="flex-1 flex flex-col items-center justify-end h-full">
            <Skeleton
              className="w-full rounded-t-md"
              style={{ height: `${height}%` }}
            />
          </div>
        ))}
      </div>
      {/* X축 라벨 영역 */}
      <div className="flex gap-2">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="flex-1 flex justify-center">
            <Skeleton className="h-3 w-6" />
          </div>
        ))}
      </div>
    </div>
  )
}
