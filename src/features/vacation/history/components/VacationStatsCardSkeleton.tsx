import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card';
import { Skeleton } from '@/components/shadcn/skeleton';

export default function VacationStatsCardSkeleton() {
  return (
    <div className='flex flex-wrap gap-6'>
      {Array(3).fill(0).map((_, index) => (
        <Card key={index} className='flex-1 min-w-80'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-1'>
            <CardTitle className='text-sm font-medium'>
              <Skeleton className='h-4 w-24' />
            </CardTitle>
            <Skeleton className='h-6 w-12' />
          </CardHeader>
          <CardContent className='py-0'>
            <Skeleton className='h-8 w-16 mt-2' />
            <Skeleton className='h-3 w-32 mt-2' />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}