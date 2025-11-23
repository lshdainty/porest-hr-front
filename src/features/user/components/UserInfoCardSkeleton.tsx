import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card';
import { Skeleton } from '@/components/shadcn/skeleton';
import { Separator } from '@/components/shadcn/separator';

export default function UserInfoCardSkeleton() {
  return (
    <div className='flex flex-col gap-6'>
      <Card className='h-full min-w-[350px]'>
        <CardHeader className='flex flex-row items-center justify-between pb-4'>
          <CardTitle>
            <Skeleton className='h-6 w-24' />
          </CardTitle>
          <Skeleton className='h-10 w-[150px]' />
        </CardHeader>
        <CardContent className='flex flex-col items-center text-center p-6'>
          <Skeleton className='w-32 h-32 mb-4 rounded-full' />
          <Skeleton className='h-8 w-20 mb-2' />
          <Skeleton className='h-4 w-32' />
          <Separator className='my-6' />
          <div className='w-full text-left space-y-5 text-sm'>
            <div className='flex items-center'>
              <Skeleton className='mr-3 h-4 w-4' />
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-4 w-32 ml-auto' />
            </div>
            <div className='flex items-center'>
              <Skeleton className='mr-3 h-4 w-4' />
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-4 w-48 ml-auto' />
            </div>
            <div className='flex items-center'>
              <Skeleton className='mr-3 h-4 w-4' />
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-4 w-40 ml-auto' />
            </div>
            <div className='flex items-center'>
              <Skeleton className='mr-3 h-4 w-4' />
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-4 w-20 ml-auto' />
            </div>
            <div className='flex items-center'>
              <Skeleton className='mr-3 h-4 w-4' />
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-4 w-32 ml-auto' />
            </div>
            <div className='flex items-center'>
              <Skeleton className='mr-3 h-4 w-4' />
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-4 w-16 ml-auto' />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}