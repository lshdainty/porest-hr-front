import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card'
import { Skeleton } from '@/components/shadcn/skeleton'
import { MonthVacationStatsSkeleton } from '@/features/vacation/history/components/MonthVacationStatsSkeleton'

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