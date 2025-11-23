import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card';
import { Skeleton } from '@/components/shadcn/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shadcn/table';
import { cn } from '@/lib/utils';

const DuesTableSkeleton = () => {
  return (
    <Card className='flex-1'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle>
            <Skeleton className='h-6 w-24' />
          </CardTitle>
          <div className='flex gap-2'>
            <Skeleton className='h-8 w-12' />
            <Skeleton className='h-8 w-12' />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className='overflow-x-auto'>
          <Table className='min-w-[1000px]'>
            <TableHeader>
              <TableRow>
                <TableHead className='min-w-[140px] pl-4'>날짜</TableHead>
                <TableHead className='min-w-[120px]'>이름</TableHead>
                <TableHead className='min-w-[250px]'>내용</TableHead>
                <TableHead className='min-w-[140px]'>금액</TableHead>
                <TableHead className='min-w-[100px]'>유형</TableHead>
                <TableHead className='min-w-[140px]'>총액</TableHead>
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
                    <Skeleton className='h-4 w-20' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-4 w-16' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-4 w-32' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-4 w-20' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-5 w-12 rounded-full' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-4 w-20' />
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

export default DuesTableSkeleton;