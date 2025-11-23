import { Card, CardContent, CardHeader } from '@/components/shadcn/card';
import { Skeleton } from '@/components/shadcn/skeleton';
import { BanknoteArrowDown, BanknoteArrowUp, DollarSign, Users } from 'lucide-react';

const TotalDuesSkeleton = () => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
      <Card className='relative overflow-hidden'>
        <CardHeader className='pb-2'>
          <div className='flex items-center gap-2'>
            <DollarSign className='w-5 h-5 text-blue-600' />
            <h3 className='text-sm font-medium text-card-foreground'>전체 운영비</h3>
          </div>
        </CardHeader>
        <CardContent>
          <div className='flex items-baseline gap-1 mb-2'>
            <Skeleton className='h-9 w-32' />
            <span className='text-lg text-card-foreground opacity-60'>원</span>
          </div>
          <Skeleton className='h-3 w-24' />
        </CardContent>
        <div className='absolute bottom-0 right-0 w-16 h-16 opacity-10'>
          <DollarSign className='w-full h-full p-3' />
        </div>
      </Card>

      <Card className='relative overflow-hidden'>
        <CardHeader className='pb-2'>
          <div className='flex items-center gap-2'>
            <BanknoteArrowUp className='w-5 h-5 text-green-600' />
            <h3 className='text-sm font-medium text-card-foreground'>운영비 입금</h3>
          </div>
        </CardHeader>
        <CardContent>
          <div className='flex items-baseline gap-1 mb-2'>
            <Skeleton className='h-9 w-32' />
            <span className='text-lg text-card-foreground opacity-60'>원</span>
          </div>
          <Skeleton className='h-3 w-20' />
        </CardContent>
        <div className='absolute bottom-0 right-0 w-16 h-16 opacity-10'>
          <BanknoteArrowUp className='w-full h-full p-3' />
        </div>
      </Card>

      <Card className='relative overflow-hidden'>
        <CardHeader className='pb-2'>
          <div className='flex items-center gap-2'>
            <BanknoteArrowDown className='w-5 h-5 text-red-600' />
            <h3 className='text-sm font-medium text-card-foreground'>운영비 출금</h3>
          </div>
        </CardHeader>
        <CardContent>
          <div className='flex items-baseline gap-1 mb-2'>
            <Skeleton className='h-9 w-32' />
            <span className='text-lg text-card-foreground opacity-60'>원</span>
          </div>
          <Skeleton className='h-3 w-20' />
        </CardContent>
        <div className='absolute bottom-0 right-0 w-16 h-16 opacity-10'>
          <BanknoteArrowDown className='w-full h-full p-3' />
        </div>
      </Card>

      <Card className='relative overflow-hidden'>
        <CardHeader className='pb-2'>
          <div className='flex items-center gap-2'>
            <Users className='w-5 h-5 text-purple-600' />
            <h3 className='text-sm font-medium text-card-foreground'>월 생일비</h3>
          </div>
        </CardHeader>
        <CardContent>
          <div className='flex items-baseline gap-1 mb-2'>
            <Skeleton className='h-9 w-32' />
            <span className='text-lg text-card-foreground opacity-60'>원</span>
          </div>
          <Skeleton className='h-3 w-16' />
        </CardContent>
        <div className='absolute bottom-0 right-0 w-16 h-16 opacity-10'>
          <Users className='w-full h-full p-3' />
        </div>
      </Card>
    </div>
  );
};

export default TotalDuesSkeleton;