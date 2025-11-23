import { Skeleton } from '@/components/shadcn/skeleton';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/shadcn/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shadcn/table';

export default function UserTableSkeleton() {
  return (
    <Card className='flex-1'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle>
            <Skeleton className='h-6 w-24' />
          </CardTitle>
          <div className='flex gap-2'>
            <Skeleton className='h-8 w-12' />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className='overflow-x-auto relative'>
          <Table className='min-w-[1200px]'>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className='min-w-[180px] w-[180px] pl-4 sticky left-0 z-5 bg-background'
                >
                  이름
                </TableHead>
                <TableHead className='min-w-[120px]'>ID</TableHead>
                <TableHead className='min-w-[220px]'>Email</TableHead>
                <TableHead className='min-w-[150px]'>생년월일</TableHead>
                <TableHead className='min-w-[120px]'>회사</TableHead>
                <TableHead className='min-w-[120px]'>부서</TableHead>
                <TableHead className='min-w-[120px]'>음력여부</TableHead>
                <TableHead className='min-w-[130px]'>유연근무제</TableHead>
                <TableHead className='min-w-[100px]'>권한</TableHead>
                <TableHead className='min-w-[80px] pr-4'></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array(5).fill(0).map((_, i) => (
                <TableRow
                  key={i}
                  className='hover:bg-muted/50 hover:text-foreground dark:hover:bg-muted/80 dark:hover:text-foreground'
                >
                  <TableCell 
                    className='pl-4 w-[180px] sticky left-0 z-5 bg-background hover:bg-muted/50 dark:hover:bg-muted/80'
                  >
                    <div className='flex items-center gap-3'>
                      <Skeleton className='w-8 h-8 rounded-full' />
                      <Skeleton className='h-4 w-20' />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-4 w-16' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-4 w-32' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-4 w-24' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-4 w-16' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-4 w-16' />
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center gap-1'>
                      <Skeleton className='w-4 h-4 rounded' />
                      <Skeleton className='h-5 w-10 rounded-full' />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-5 w-12 rounded-full' />
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center gap-1'>
                      <Skeleton className='w-4 h-4 rounded' />
                      <Skeleton className='h-4 w-12' />
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
      </CardContent>
    </Card>
  )
}