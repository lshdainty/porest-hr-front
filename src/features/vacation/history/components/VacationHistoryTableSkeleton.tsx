import { Skeleton } from '@/components/shadcn/skeleton';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/shadcn/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shadcn/table';
import { cn } from '@/lib/utils';

export default function VacationHistoryTableSkeleton() {
  return (
    <Card className='flex-1'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle>
            <Skeleton className='h-6 w-20' />
          </CardTitle>
          <div className='flex gap-2'>
            <Skeleton className='h-8 w-12' />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className='overflow-x-auto relative'>
          <Table className='min-w-[800px]'>
            <TableHeader>
              <TableRow>
                <TableHead className='min-w-[200px] pl-4'>날짜</TableHead>
                <TableHead className='min-w-[150px]'>휴가 종류</TableHead>
                <TableHead className='min-w-[300px]'>사유</TableHead>
                <TableHead className='min-w-[80px] pr-4'></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array(5).fill(0).map((_, i) => (
                <TableRow
                  key={i}
                  className={cn(
                    'hover:bg-muted/50 hover:text-foreground',
                    'dark:hover:bg-muted/80 dark:hover:text-foreground'
                  )}
                >
                  <TableCell className='pl-4'>
                    <Skeleton className='h-4 w-32' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-4 w-20' />
                  </TableCell>
                  <TableCell>
                    <div className='max-w-[300px]'>
                      <Skeleton className='h-4 w-48' />
                    </div>
                  </TableCell>
                  <TableCell className='pr-4'>
                    <div className='flex justify-end'>
                      <Skeleton className='h-8 w-8 rounded' />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className='flex items-center justify-between p-4'>
          <div className='text-sm text-muted-foreground'>
            <Skeleton className='h-4 w-16' />
          </div>
          <div className='flex items-center space-x-6 lg:space-x-8'>
            <div className='flex items-center space-x-2'>
              <Skeleton className='h-4 w-24' />
            </div>
            <div className='flex items-center space-x-2'>
              <Skeleton className='h-8 w-8 rounded' />
              <Skeleton className='h-8 w-8 rounded' />
              <Skeleton className='h-8 w-8 rounded' />
              <Skeleton className='h-8 w-8 rounded' />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}