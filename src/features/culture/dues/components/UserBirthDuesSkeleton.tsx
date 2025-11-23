import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card';
import { Skeleton } from '@/components/shadcn/skeleton';
import React from 'react';

const UserBirthDuesSkeleton = () => {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className='h-6 w-48' />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='overflow-x-auto'>
            <div className='grid grid-cols-13 gap-x-2 gap-y-2 text-center text-sm items-center min-w-[780px]'>
              <div className='font-semibold'></div>
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className='font-semibold'>
                  <Skeleton className='h-5 w-10 mx-auto' />
                </div>
              ))}
              {Array.from({ length: 5 }).map((_, i) => (
                <React.Fragment key={i}>
                  <div key={`sk-name-${i}`} className='font-semibold text-left py-1'>
                    <Skeleton className='h-5 w-16' />
                  </div>
                  {Array.from({ length: 12 }).map((_, j) => (
                    <div key={`sk-month-${i}-${j}`} className='flex justify-center items-center'>
                      <Skeleton className='w-12 h-10 rounded-md' />
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserBirthDuesSkeleton;