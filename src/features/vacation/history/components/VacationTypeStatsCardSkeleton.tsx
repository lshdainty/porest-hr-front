import { Skeleton } from '@/components/shadcn/skeleton'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shadcn/card'
import { VacationTypeStatsSkeleton } from '@/features/vacation/history/components/VacationTypeStatsSkeleton'

const VacationTypeStatsCardSkeleton = () => {
  return (
    <Card className='flex flex-col'>
      <CardHeader className='items-center pb-0 flex-shrink-0'>
        <CardTitle>
          <Skeleton className='h-6 w-24' />
        </CardTitle>
        <CardDescription>
          <Skeleton className='h-4 w-40 mt-1' />
        </CardDescription>
      </CardHeader>
      <CardContent
        className='flex-1 pb-0 flex flex-col'
        style={{
          minHeight: '300px'
        }}
      >
        <VacationTypeStatsSkeleton />
      </CardContent>
    </Card>
  )
}

export { VacationTypeStatsCardSkeleton }