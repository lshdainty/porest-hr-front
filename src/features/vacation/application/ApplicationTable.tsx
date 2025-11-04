import { useGetUserRequestedVacations, useGetUserRequestedVacationStats } from '@/api/vacation';
import { Badge } from '@/components/shadcn/badge';
import { Button } from '@/components/shadcn/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card';
import { Progress } from '@/components/shadcn/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/shadcn/table';
import { useLoginUserStore } from '@/store/LoginUser';
import dayjs from 'dayjs';
import {
  Calendar,
  CalendarDays,
  CheckCircle,
  Clock,
  Eye,
  FileText,
  Plus,
  Timer,
  TrendingUp,
  XCircle
} from 'lucide-react';


const getStatusBadge = (status: string) => {
  const statusConfig = {
    PENDING: {
      label: '검토중',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      icon: Timer
    },
    PROGRESS: {
      label: '진행중',
      color: 'bg-blue-100 text-blue-800 border-blue-300',
      icon: Clock
    },
    APPROVED: {
      label: '승인완료',
      color: 'bg-green-100 text-green-800 border-green-300',
      icon: CheckCircle
    },
    REJECTED: {
      label: '반려',
      color: 'bg-red-100 text-red-800 border-red-300',
      icon: XCircle
    }
  };

  const config = statusConfig[status as keyof typeof statusConfig];
  if (!config) return null;
  const IconComponent = config.icon;

  return (
    <Badge className={`${config.color} border flex items-center gap-1`}>
      <IconComponent className='w-3 h-3' />
      {config.label}
    </Badge>
  );
};

interface OvertimeListPageProps {
  onCreateNew: () => void;
}

export default function ApplicationTable({ onCreateNew }: OvertimeListPageProps) {
  const loginUser = useLoginUserStore((state) => state.loginUser);

  // API 호출
  const { data: vacationRequests = [], isLoading: isLoadingRequests } = useGetUserRequestedVacations({
    user_id: loginUser?.user_id || ''
  });

  const { data: stats, isLoading: isLoadingStats } = useGetUserRequestedVacationStats({
    user_id: loginUser?.user_id || ''
  });

  // 통계 데이터
  const totalRequests = stats?.total_request_count || 0;
  const pendingRequests = stats?.pending_count || 0;
  const inProgressRequests = stats?.progress_count || 0;
  const approvedRequests = stats?.approved_count || 0;
  const rejectedRequests = stats?.rejected_count || 0;
  const approvalRate = stats?.approval_rate || 0;
  const thisMonthRequests = stats?.current_month_request_count || 0;
  const requestGrowth = stats?.change_rate || 0;
  const averageProcessingDays = stats?.average_processing_days || 0;

  const isLoading = isLoadingRequests || isLoadingStats;

  return (
    <div className='h-full w-full'>
      <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8'>
        <div>
          <h1 className='text-3xl font-bold mb-2'>휴가 신청 관리</h1>
          <p className='text-gray-600'>휴가를 신청하고 현황을 관리하세요</p>
        </div>
        <Button onClick={onCreateNew} className='flex items-center gap-2 mt-4 lg:mt-0'>
          <Plus className='w-4 h-4' />
          새 신청서 작성
        </Button>
      </div>

      {/* 주요 지표 카드들 - 전체 화면 너비 활용 */}
      <div className='grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8'>
        <Card className='relative overflow-hidden'>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between mb-4'>
              <div className='w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center'>
                <FileText className='w-6 h-6 text-blue-600' />
              </div>
              <div className='flex items-center gap-1 text-xs'>
                <TrendingUp className='w-3 h-3 text-green-600' />
                <span className='text-green-600 font-medium'>+{requestGrowth.toFixed(1)}%</span>
              </div>
            </div>
            <div>
              <p className='text-sm text-gray-600 mb-1'>총 신청</p>
              <p className='text-2xl font-bold text-blue-600'>{totalRequests}</p>
              <p className='text-xs text-gray-500 mt-1'>이번 달 {thisMonthRequests}건</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between mb-4'>
              <div className='w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center'>
                <Timer className='w-6 h-6 text-yellow-600' />
              </div>
              <Badge variant='secondary' className='bg-yellow-100 text-yellow-800'>
                대기
              </Badge>
            </div>
            <div>
              <p className='text-sm text-gray-600 mb-1'>대기</p>
              <p className='text-2xl font-bold text-yellow-600'>{pendingRequests}</p>
              <p className='text-xs text-gray-500 mt-1'>평균 처리시간 {averageProcessingDays.toFixed(1)}일</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between mb-4'>
              <div className='w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center'>
                <Clock className='w-6 h-6 text-blue-600' />
              </div>
              <Badge variant='secondary' className='bg-blue-100 text-blue-800'>
                진행
              </Badge>
            </div>
            <div>
              <p className='text-sm text-gray-600 mb-1'>진행</p>
              <p className='text-2xl font-bold text-blue-600'>{inProgressRequests}</p>
              <p className='text-xs text-gray-500 mt-1'>처리중인 요청</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between mb-4'>
              <div className='w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center'>
                <CheckCircle className='w-6 h-6 text-green-600' />
              </div>
              <div className='text-right'>
                <p className='text-xs text-gray-500'>승인율</p>
                <p className='text-sm font-semibold text-green-600'>{approvalRate.toFixed(0)}%</p>
              </div>
            </div>
            <div>
              <p className='text-sm text-gray-600 mb-1'>승인</p>
              <p className='text-2xl font-bold text-green-600'>{approvedRequests}</p>
              <div className='mt-2'>
                <Progress value={approvalRate} className='h-2' />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between mb-4'>
              <div className='w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center'>
                <XCircle className='w-6 h-6 text-red-600' />
              </div>
              <Badge variant='secondary' className='bg-red-100 text-red-800'>
                반려
              </Badge>
            </div>
            <div>
              <p className='text-sm text-gray-600 mb-1'>반려</p>
              <p className='text-2xl font-bold text-red-600'>{rejectedRequests}</p>
              <p className='text-xs text-gray-500 mt-1'>재신청 필요</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between mb-4'>
              <div className='w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center'>
                <CalendarDays className='w-6 h-6 text-purple-600' />
              </div>
            </div>
            <div>
              <p className='text-sm text-gray-600 mb-1'>획득 휴가</p>
              <p className='text-2xl font-bold text-purple-600'>{stats?.acquired_vacation_time_str || '0일'}</p>
              <p className='text-xs text-gray-500 mt-1'>승인된 휴가</p>
            </div>
          </CardContent>
        </Card>
      </div>

{/* TODO
TableHead className='min-w-[200px]'>제목</TableHead>
       246 -                    <TableHead>부서</TableHead>
       245 +                    <TableHead className='min-w-[180px]'>정책명</TableHead>
       246 +                    <TableHead>휴가 타입</TableHead>
       247                      <TableHead>신청일</TableHead>
       248 -                    <TableHead>초과근무일</TableHead>
       249 -                    <TableHead>시간</TableHead>
       250 -                    <TableHead>보상일수</TableHead>
       251 -                    <TableHead>결재자</TableHead>
       248 +                    <TableHead>부여일</TableHead>
       249 +                    <TableHead>만료일</TableHead>
       250 +                    <TableHead>부여 시간</TableHead>
       251 +                    <TableHead>잔여 시간</TableHead>
       252                      <TableHead>상태</TableHead>
       253                      <TableHead>액션</TableHead>
 컬럼의 경우 기존에 목데이터를 통해 나타내는 정보가 더 활용도가 높음 
 지금은 단순 db에 있는 데이터만 조회해서 보여지도록 했지만 휴가 신청 로직이 끝난 후
 테스트를 통해 기존에 보여주던 컬럼으로 원복 및 데이터를 추가해서 기존 컬럼 데이터가
 보여지도록 수정 필요
*/}

      {/* 신청 내역 테이블 - 전체 너비 활용 */}
      <Card className='flex-1'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle>신청 내역</CardTitle>
            <div className='flex gap-2'>
              <Badge variant='outline' className='bg-blue-50 text-blue-700'>
                전체 {totalRequests}건
              </Badge>
              <Badge variant='outline' className='bg-yellow-50 text-yellow-700'>
                검토중 {pendingRequests}건
              </Badge>
              <Badge variant='outline' className='bg-green-50 text-green-700'>
                승인 {approvedRequests}건
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='min-w-[180px]'>정책명</TableHead>
                  <TableHead>휴가 타입</TableHead>
                  <TableHead>신청일</TableHead>
                  <TableHead>부여일</TableHead>
                  <TableHead>만료일</TableHead>
                  <TableHead>부여 시간</TableHead>
                  <TableHead>잔여 시간</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>액션</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} className='text-center py-8'>
                      <div className='flex justify-center'>
                        <Clock className='w-6 h-6 animate-spin text-gray-400' />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : vacationRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className='text-center py-8 text-gray-500'>
                      신청한 휴가가 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  vacationRequests.map((request) => (
                    <TableRow key={request.vacation_grant_id} className='hover:bg-gray-50'>
                      <TableCell>
                        <div className='max-w-[200px]'>
                          <p className='font-medium'>{request.policy_name}</p>
                          {request.desc && (
                            <p className='text-xs text-gray-500 mt-1 line-clamp-2'>
                              {request.desc}
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
                        {dayjs(request.request_date).format('YYYY-MM-DD')}
                      </TableCell>
                      <TableCell>
                        {dayjs(request.grant_date).format('YYYY-MM-DD')}
                      </TableCell>
                      <TableCell>
                        {dayjs(request.expiry_date).format('YYYY-MM-DD')}
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center gap-1'>
                          <Calendar className='w-3 h-3 text-blue-500' />
                          {request.grant_time_str}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center gap-1'>
                          <CalendarDays className='w-3 h-3 text-purple-500' />
                          {request.remain_time_str}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(request.grant_status)}
                      </TableCell>
                      <TableCell>
                        <Button variant='outline' size='sm' className='flex items-center gap-1'>
                          <Eye className='w-3 h-3' />
                          상세보기
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
