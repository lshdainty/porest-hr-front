import { Skeleton } from '@/components/shadcn/skeleton'

export const VacationTypeStatsSkeleton = () => {
  return (
    <div className="h-full w-full p-4 flex flex-col">
      {/* 도넛 차트 영역 */}
      <div className="flex-1 flex items-center justify-center">
        <div className="relative w-[260px] h-[260px]">
          {/* 도넛 링 - SVG로 구현 */}
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* 배경 원 (도넛 링) */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              className="stroke-muted"
              strokeWidth="16"
            />
            {/* 섹션 구분선 */}
            {[0, 72, 144, 216, 288].map((angle, index) => {
              const rad = (angle * Math.PI) / 180
              const x1 = 50 + 32 * Math.cos(rad)
              const y1 = 50 + 32 * Math.sin(rad)
              const x2 = 50 + 48 * Math.cos(rad)
              const y2 = 50 + 48 * Math.sin(rad)
              return (
                <line
                  key={index}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  className="stroke-background"
                  strokeWidth="0.5"
                />
              )
            })}
          </svg>
          {/* 중앙 텍스트 영역 */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Skeleton className="h-8 w-20 mb-1" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
      </div>
      {/* 범례 영역 */}
      <div className="flex w-full items-center justify-center gap-4 pt-4 flex-wrap">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex items-center gap-1.5">
            <Skeleton className="h-2.5 w-2.5 rounded-full" />
            <Skeleton className="h-3 w-8" />
          </div>
        ))}
      </div>
    </div>
  )
}
