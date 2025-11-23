import { Skeleton } from '@/components/shadcn/skeleton';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/shadcn/card';

export default function VacationTypeStatsCardSkeleton() {
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
        <div 
          className='flex items-center justify-center'
          style={{
            minWidth: '300px',
            minHeight: '300px'
          }}
        >
          <div className='relative flex items-center justify-center'>
            <Skeleton className='w-[200px] h-[200px] rounded-full' />
            <div className='absolute inset-0 flex flex-col items-center justify-center'>
              <Skeleton className='h-8 w-16 mb-1' />
              <Skeleton className='h-4 w-12' />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className='flex-col gap-2 text-sm pt-4 flex-shrink-0'>
        <div className='flex w-full items-center justify-center gap-2 text-muted-foreground flex-wrap'>
          <div className='flex items-center gap-1.5 whitespace-nowrap'>
            <Skeleton className='h-2.5 w-2.5 rounded-full' />
            <Skeleton className='h-3 w-12' />
          </div>
          <div className='flex items-center gap-1.5 whitespace-nowrap'>
            <Skeleton className='h-2.5 w-2.5 rounded-full' />
            <Skeleton className='h-3 w-12' />
          </div>
          <div className='flex items-center gap-1.5 whitespace-nowrap'>
            <Skeleton className='h-2.5 w-2.5 rounded-full' />
            <Skeleton className='h-3 w-12' />
          </div>
          <div className='flex items-center gap-1.5 whitespace-nowrap'>
            <Skeleton className='h-2.5 w-2.5 rounded-full' />
            <Skeleton className='h-3 w-12' />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}