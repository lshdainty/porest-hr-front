import { Skeleton } from '@/components/shadcn/skeleton'

export const MonthVacationStatsSkeleton = () => {
  // 12개월 바 높이 (랜덤하게 보이도록 다양한 높이 설정)
  const barHeights = [60, 80, 45, 70, 90, 55, 75, 85, 50, 65, 40, 95]

  return (
    <div className="h-full w-full p-4 flex flex-col">
      <div className="flex-1 flex">
        {/* Y축 라벨 영역 */}
        <div className="flex flex-col justify-between items-end pr-2 pb-6">
          {[4, 3, 2, 1, 0].map((_, index) => (
            <Skeleton key={index} className="h-3 w-4" />
          ))}
        </div>
        {/* 차트 영역 */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 relative">
            {/* 가로 그리드 라인 */}
            {[0, 1, 2, 3, 4].map((_, index) => (
              <div
                key={index}
                className="absolute w-full border-t border-border"
                style={{ top: `${index * 25}%` }}
              />
            ))}
            {/* 바 차트 */}
            <div className="absolute inset-0 flex items-end gap-2 px-1">
              {barHeights.map((height, index) => (
                <div key={index} className="flex-1 flex justify-center h-full items-end">
                  <Skeleton
                    className="w-3/4 rounded-t-sm"
                    style={{ height: `${height}%` }}
                  />
                </div>
              ))}
            </div>
          </div>
          {/* X축 라벨 영역 */}
          <div className="flex gap-2 pt-2">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="flex-1 flex justify-center">
                <Skeleton className="h-3 w-6" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
