import { useEffect, useState } from 'react';
import { GetUserPeriodVacationUseHistoriesResp } from '@/api/vacation';
import { Button } from '@/components/shadcn/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shadcn/table';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/shadcn/dropdownMenu';
import { EllipsisVertical, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RegistEventDialog } from '@/components/calendar/RegistEventDialog';
import { useCalendarSlotStore } from '@/store/CalendarSlotStore';
import dayjs from 'dayjs';

interface VacationHistoryTableProps {
  value: GetUserPeriodVacationUseHistoriesResp[];
  canAdd?: boolean;
}

const formatDateTime = (dateTimeString: string) => {
  if (!dateTimeString) {
    return '';
  }
  const date = new Date(dateTimeString);
  if (isNaN(date.getTime())) {
    return dateTimeString;
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}.${month}.${day} ${hours}:${minutes}`;
};

export default function VacationHistoryTable({ value: data, canAdd = false }: VacationHistoryTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const { setSlots, setOpen } = useCalendarSlotStore(s => s.actions);

  useEffect(() => {
    const totalPages = Math.ceil(data.length / rowsPerPage);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [data, currentPage, rowsPerPage]);

  const handleAddVacation = () => {
    const now = dayjs();
    setSlots(now.toDate(), now.toDate());
    setOpen(true);
  };

  const handleEdit = (id: number) => {
    console.log(`Edit item with id: ${id}`);
  };

  const handleDelete = (id: number) => {
    console.log(`Delete item with id: ${id}`);
  };

  const totalPages = data.length > 0 ? Math.ceil(data.length / rowsPerPage) : 1;
  const paginatedData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <>
      <Card className='flex-1'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle>휴가 이력</CardTitle>
            {canAdd && (
              <div className='flex gap-2'>
                <Button className='text-sm h-8' size='sm' onClick={handleAddVacation}>휴가 사용</Button>
              </div>
            )}
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
              {paginatedData.map((item) => (
                <TableRow
                  key={item.vacation_history_id}
                  className={cn(
                    'hover:bg-muted/50 hover:text-foreground',
                    'dark:hover:bg-muted/80 dark:hover:text-foreground'
                  )}
                >
                  <TableCell className='pl-4'>
                    {formatDateTime(item.start_date)}
                  </TableCell>
                  <TableCell>
                    {item.vacation_time_type_name}
                  </TableCell>
                  <TableCell>
                    <div className='max-w-[300px]'>
                      <p className='font-medium'>{item.vacation_desc}</p>
                    </div>
                  </TableCell>
                  <TableCell className='pr-4'>
                    <div className='flex justify-end'>
                      <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='h-8 w-8 p-0 data-[state=open]:bg-muted hover:bg-muted'
                          >
                            <EllipsisVertical className='w-4 h-4' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end' className='w-32'>
                          <DropdownMenuItem onClick={() => handleEdit(item.vacation_history_id)}>
                            <Pencil className='h-4 w-4' />
                            <span>수정</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className='text-destructive focus:text-destructive hover:!bg-destructive/20'
                            onClick={() => handleDelete(item.vacation_history_id)}
                          >
                            <Trash2 className='h-4 w-4' />
                            <span>삭제</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className='flex items-center justify-between p-4'>
          <div className='text-sm text-muted-foreground'>
            {data.length} row(s)
          </div>
          <div className='flex items-center space-x-6 lg:space-x-8'>
            <div className='flex items-center space-x-2'>
              <p className='text-sm font-medium'>
                Page {currentPage} of {totalPages}
              </p>
            </div>
            <div className='flex items-center space-x-2'>
              <Button
                variant='outline'
                className='h-8 w-8 p-0'
                onClick={() => setCurrentPage(1)}
                disabled={currentPage <= 1}
              >
                <span className='sr-only'>Go to first page</span>
                <ChevronsLeft className='h-4 w-4' />
              </Button>
              <Button
                variant='outline'
                className='h-8 w-8 p-0'
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage <= 1}
              >
                <span className='sr-only'>Go to previous page</span>
                <ChevronLeft className='h-4 w-4' />
              </Button>
              <Button
                variant='outline'
                className='h-8 w-8 p-0'
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
              >
                <span className='sr-only'>Go to next page</span>
                <ChevronRight className='h-4 w-4' />
              </Button>
              <Button
                variant='outline'
                className='h-8 w-8 p-0'
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage >= totalPages}
              >
                <span className='sr-only'>Go to last page</span>
                <ChevronsRight className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
    <RegistEventDialog />
    </>
  );
}