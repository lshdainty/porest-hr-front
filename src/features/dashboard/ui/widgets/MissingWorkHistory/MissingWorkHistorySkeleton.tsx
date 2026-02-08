import { Card, CardContent } from '@/shared/ui/shadcn/card'
import { Skeleton } from '@/shared/ui/shadcn/skeleton'

export const MissingWorkHistorySkeleton = () => {
  return (
    <Card className="h-full flex flex-col border-none shadow-none py-0">
      <CardContent className="flex-1 flex items-center justify-center p-0">
        <div className="p-3">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-16" />
            </div>
            <div className="grid grid-cols-7 gap-1">
              {[...Array(7)].map((_, i) => (
                <Skeleton key={`header-${i}`} className="h-8 w-8" />
              ))}
              {[...Array(35)].map((_, i) => (
                <Skeleton key={`day-${i}`} className="h-8 w-8 rounded-full" />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
