import { Card, CardContent, CardHeader } from '@/shared/ui/shadcn/card'
import { Skeleton } from '@/shared/ui/shadcn/skeleton'

export const TodayWorkStatusSkeleton = () => {
  return (
    <Card className="h-full flex flex-col border-none shadow-none">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center gap-4">
        <div className="flex items-end justify-between">
          <div className="flex items-baseline gap-1">
            <Skeleton className="h-8 w-12" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-4 w-8" />
        </div>
        <Skeleton className="h-2 w-full" />
        <Skeleton className="h-3 w-32" />
      </CardContent>
    </Card>
  )
}
