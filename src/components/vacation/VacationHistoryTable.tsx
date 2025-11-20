import { AddEventDialog } from '@/components/calendar/components/dialogs/add-event-dialog';
import { EditEventDialog } from '@/components/calendar/components/dialogs/edit-event-dialog';
import { IEvent } from '@/components/calendar/interfaces';
import { calendarTypes } from '@/components/calendar/types';
import { Button } from '@/components/shadcn/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/shadcn/dropdownMenu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shadcn/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shadcn/tabs';
import { useDeleteVacationUsageMutation } from '@/hooks/queries/useVacations';
import { GetUserVacationHistoryResp } from '@/lib/api/vacation';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, EllipsisVertical, Pencil, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface VacationHistoryTableProps {
  value: GetUserVacationHistoryResp;
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

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
};

export default function VacationHistoryTable({ value: data, canAdd = false }: VacationHistoryTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null);
  const rowsPerPage = 5;
  const [activeTab, setActiveTab] = useState('usages');

  const { mutate: deleteVacationUsage } = useDeleteVacationUsageMutation();

  const grants = data?.grants || [];
  const usages = data?.usages || [];

  const currentData = activeTab === 'grants' ? grants : usages;

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const totalPages = currentData.length > 0 ? Math.ceil(currentData.length / rowsPerPage) : 1;
  const paginatedData = currentData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleAddVacation = () => {
    setAddDialogOpen(true);
  };

  const handleEdit = (item: any) => {
    // IEvent 형태로 변환
    const event: IEvent = {
      id: item.vacation_usage_id,
      type: calendarTypes.find(c => c.type === 'vacation') || calendarTypes[0], // 기본값 설정
      title: item.vacation_usage_desc,
      description: item.vacation_usage_desc,
      startDate: item.start_date,
      endDate: item.end_date,
      vacationType: item.vacation_time_type,
      user: { id: '', name: '', picturePath: null } // 필수 필드 채움 (실제로는 사용되지 않음)
    };
    setSelectedEvent(event);
    setEditDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      deleteVacationUsage(id);
    }
  };

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
          <Tabs defaultValue="usages" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="usages">사용 내역</TabsTrigger>
              <TabsTrigger value="grants">부여 내역</TabsTrigger>
            </TabsList>

            <div className='mt-4 overflow-x-auto relative min-h-[300px]'>
              <TabsContent value="usages">
                <Table className='min-w-[800px]'>
                  <TableHeader>
                    <TableRow>
                      <TableHead className='min-w-[200px] pl-4'>사용 기간</TableHead>
                      <TableHead className='min-w-[150px]'>휴가 종류</TableHead>
                      <TableHead className='min-w-[300px]'>사유</TableHead>
                      <TableHead className='min-w-[100px]'>사용 시간</TableHead>
                      <TableHead className='min-w-[80px] pr-4'></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          사용 내역이 없습니다.
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedData.map((item: any) => (
                        <TableRow
                          key={item.vacation_usage_id}
                          className={cn(
                            'hover:bg-muted/50 hover:text-foreground',
                            'dark:hover:bg-muted/80 dark:hover:text-foreground',
                            'h-16'
                          )}
                        >
                          <TableCell className='pl-4'>
                            {formatDateTime(item.start_date)} ~ {formatDateTime(item.end_date)}
                          </TableCell>
                          <TableCell>
                            {item.vacation_time_type_name}
                          </TableCell>
                          <TableCell>
                            <div className='max-w-[300px]'>
                              <p className='font-medium truncate'>{item.vacation_usage_desc}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            {item.used_time}
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
                                  <DropdownMenuItem onClick={() => handleEdit(item)}>
                                    <Pencil className='h-4 w-4' />
                                    <span>수정</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className='text-destructive focus:text-destructive hover:!bg-destructive/20'
                                    onClick={() => handleDelete(item.vacation_usage_id)}
                                  >
                                    <Trash2 className='h-4 w-4' />
                                    <span>삭제</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="grants">
                <Table className='min-w-[800px]'>
                  <TableHeader>
                    <TableRow>
                      <TableHead className='min-w-[150px] pl-4'>휴가 종류</TableHead>
                      <TableHead className='min-w-[250px]'>내용</TableHead>
                      <TableHead className='min-w-[100px]'>부여 시간</TableHead>
                      <TableHead className='min-w-[100px]'>남은 시간</TableHead>
                      <TableHead className='min-w-[150px]'>부여일</TableHead>
                      <TableHead className='min-w-[150px]'>만료일</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          부여 내역이 없습니다.
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedData.map((item: any) => (
                        <TableRow
                          key={item.vacation_grant_id}
                          className={cn(
                            'hover:bg-muted/50 hover:text-foreground',
                            'dark:hover:bg-muted/80 dark:hover:text-foreground',
                            'h-16'
                          )}
                        >
                          <TableCell className='pl-4'>
                            {item.vacation_type_name}
                          </TableCell>
                          <TableCell>
                            <div className='max-w-[250px]'>
                              <p className='font-medium truncate'>{item.vacation_grant_desc}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            {item.grant_time}시간
                          </TableCell>
                          <TableCell>
                            {item.remain_time}시간
                          </TableCell>
                          <TableCell>
                            {formatDate(item.grant_date)}
                          </TableCell>
                          <TableCell>
                            {formatDate(item.expiry_date)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TabsContent>
            </div>

            <div className='flex items-center justify-between p-4 border-t'>
              <div className='text-sm text-muted-foreground'>
                {currentData.length} row(s)
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
          </Tabs>
        </CardContent>
      </Card>
      <AddEventDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />
      {selectedEvent && (
        <EditEventDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          event={selectedEvent}
        >
          <></>
        </EditEventDialog>
      )}
    </>
  );
}