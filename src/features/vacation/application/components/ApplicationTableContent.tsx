import { Badge } from '@/components/shadcn/badge';
import { Button } from '@/components/shadcn/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/shadcn/dropdownMenu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/shadcn/table';
import { TypeResp } from '@/lib/api/type';
import { GetUserRequestedVacationsResp } from '@/lib/api/vacation';
import { getStatusBadge } from '@/utils/vacationStatus';
import dayjs from 'dayjs';
import {
  Calendar,
  EllipsisVertical,
  Eye,
  XCircle
} from 'lucide-react';

interface ApplicationTableContentProps {
  vacationRequests: GetUserRequestedVacationsResp[];
  grantStatusTypes: TypeResp[];
  onDetailView: (request: GetUserRequestedVacationsResp) => void;
  onCancelRequest: (requestId: number) => void;
}

const ApplicationTableContent = ({
  vacationRequests,
  grantStatusTypes,
  onDetailView,
  onCancelRequest,
}: ApplicationTableContentProps) => {
  return (
    <div className='overflow-x-auto'>
      <Table className='min-w-[1000px]'>
        <TableHeader>
          <TableRow>
            <TableHead className='min-w-[200px] whitespace-nowrap'>제목</TableHead>
            <TableHead className='min-w-[100px] whitespace-nowrap'>휴가 타입</TableHead>
            <TableHead className='min-w-[120px] whitespace-nowrap'>신청일</TableHead>
            <TableHead className='min-w-[150px] whitespace-nowrap'>대상일자</TableHead>
            <TableHead className='min-w-[100px] whitespace-nowrap'>보상일수</TableHead>
            <TableHead className='min-w-[100px] whitespace-nowrap'>현결재자</TableHead>
            <TableHead className='min-w-[100px] whitespace-nowrap'>상태</TableHead>
            <TableHead className='min-w-[50px]'></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vacationRequests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className='text-center py-8 text-muted-foreground'>
                신청한 휴가가 없습니다.
              </TableCell>
            </TableRow>
          ) : (
            vacationRequests.map((request) => (
              <TableRow
                key={request.vacation_grant_id}
                className='hover:bg-muted/50 hover:text-foreground dark:hover:bg-muted/80 dark:hover:text-foreground'
              >
                <TableCell>
                  <div className='max-w-[200px]'>
                    <p className='font-medium'>{request.desc || request.policy_name}</p>
                    {request.request_desc && (
                      <p className='text-xs text-muted-foreground mt-1 line-clamp-2'>
                        {request.request_desc}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant='outline' className='text-xs'>
                    {request.vacation_type_name}
                  </Badge>
                </TableCell>
                <TableCell>
                  {dayjs(request.create_date).format('YYYY-MM-DD')}
                </TableCell>
                <TableCell>
                  {request.request_end_time ? (
                    <div className='text-sm'>
                      {dayjs(request.request_start_time).format('YYYY-MM-DD')}
                      <br />
                      <span className='text-xs text-muted-foreground'>
                        {dayjs(request.request_start_time).format('HH:mm')} ~ {dayjs(request.request_end_time).format('HH:mm')}
                      </span>
                    </div>
                  ) : (
                    dayjs(request.request_start_time).format('YYYY-MM-DD')
                  )}
                </TableCell>
                <TableCell>
                  <div className='flex items-center gap-1'>
                    <Calendar className='w-3 h-3 text-blue-500' />
                    {request.grant_time_str}
                  </div>
                </TableCell>
                <TableCell>
                  {request.grant_status === 'CANCELED' ? (
                    <span className='text-xs text-muted-foreground'>-</span>
                  ) : request.current_approver_name ? (
                    <div className='flex items-center gap-1'>
                      <Badge variant='outline' className='bg-sky-50 text-sky-700'>
                        {request.current_approver_name}
                      </Badge>
                    </div>
                  ) : (
                    <span className='text-xs text-muted-foreground'>-</span>
                  )}
                </TableCell>
                <TableCell>
                  {getStatusBadge(
                    request.grant_status,
                    grantStatusTypes.find(type => type.code === request.grant_status)?.name || request.grant_status
                  )}
                </TableCell>
                <TableCell>
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
                        <DropdownMenuItem
                          onSelect={() => onDetailView(request)}
                        >
                          <Eye className='h-4 w-4' />
                          <span>상세보기</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onSelect={() => onCancelRequest(request.vacation_grant_id)}
                          className='text-destructive focus:text-destructive hover:!bg-destructive/20'
                        >
                          <XCircle className='h-4 w-4' />
                          <span>신청취소</span>
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
    </div>
  );
};

export default ApplicationTableContent;
