import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card'
import { Skeleton } from '@/components/shadcn/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shadcn/table'

const ApplicationTableSkeleton = () => {
  return (
    <Card className='flex-1'>
      <CardHeader>
        <CardTitle>
          <Skeleton className='h-6 w-24' />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='min-w-[200px]'>제목</TableHead>
                <TableHead>휴가 타입</TableHead>
                <TableHead>신청일</TableHead>
                <TableHead>대상일자</TableHead>
                <TableHead>보상일수</TableHead>
                <TableHead>현결재자</TableHead>
                <TableHead>상태</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array(5).fill(0).map((_, i) => (
                <TableRow
                  key={i}
                  className='hover:bg-muted/50 hover:text-foreground dark:hover:bg-muted/80 dark:hover:text-foreground'
                >
                  <TableCell>
                    <div className='max-w-[200px]'>
                      <Skeleton className='h-4 w-32 mb-1' />
                      <Skeleton className='h-3 w-24' />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-5 w-16 rounded-full' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-4 w-24' />
                  </TableCell>
                  <TableCell>
                    <div>
                      <Skeleton className='h-4 w-24 mb-1' />
                      <Skeleton className='h-3 w-20' />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center gap-1'>
                      <Skeleton className='w-3 h-3 rounded' />
                      <Skeleton className='h-4 w-12' />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-5 w-20 rounded-full' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-5 w-16 rounded-full' />
                  </TableCell>
                  <TableCell>
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

export { ApplicationTableSkeleton }
