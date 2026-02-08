import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/shadcn/card'
import { Skeleton } from '@/shared/ui/shadcn/skeleton'
import { MonthVacationStatsSkeleton } from '@/features/vacation-history/ui/MonthVacationStatsSkeleton'

const MonthVacationStatsCardSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className='h-6 w-40' />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='h-[350px]'>
          <MonthVacationStatsSkeleton />
        </div>
      </CardContent>
    </Card>
  )
}

export { MonthVacationStatsCardSkeleton }