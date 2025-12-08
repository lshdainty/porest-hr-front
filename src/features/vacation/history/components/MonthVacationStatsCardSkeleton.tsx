import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card';
import { Skeleton } from '@/components/shadcn/skeleton';

const MonthVacationStatsCardSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className='h-6 w-40' />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Skeleton className='w-full h-[350px]' />
      </CardContent>
    </Card>
  )
}

export { MonthVacationStatsCardSkeleton }