import { Skeleton } from '@/components/shadcn/skeleton'

export const VacationRequestStatsSkeleton = () => {
  return (
    <div className="w-full h-full overflow-x-auto">
      <div className="flex flex-wrap h-full items-stretch bg-card">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="p-6 border-r border-border min-w-[140px] flex-1"
          >
            <div className="w-full h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="w-12 h-12 rounded-lg" />
                <Skeleton className="h-5 w-12 rounded-full" />
              </div>
              <div className="flex-1 flex flex-col">
                <Skeleton className="h-4 w-16 mb-1" />
                <Skeleton className="h-8 w-12 mb-1" />
                <Skeleton className="h-3 w-24 mt-1" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
