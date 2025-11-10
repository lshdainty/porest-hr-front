import { useGetUserRequestedVacationStats } from '@/api/vacation';
import { Badge } from '@/components/shadcn/badge';
import { Card, CardContent } from '@/components/shadcn/card';
import { Progress } from '@/components/shadcn/progress';
import {
  Ban,
  CalendarDays,
  CheckCircle,
  Clock,
  FileText,
  Timer,
  TrendingUp,
  XCircle
} from 'lucide-react';

interface VacationRequestStatsCardsProps {
  user_id: string;
}

export default function VacationRequestStatsCards({ user_id }: VacationRequestStatsCardsProps) {
  const { data: stats, isLoading: isLoadingStats } = useGetUserRequestedVacationStats({
    user_id
  });

  // 통계 데이터
  const totalRequests = stats?.total_request_count || 0;
  const pendingRequests = stats?.pending_count || 0;
  const inProgressRequests = stats?.progress_count || 0;
  const approvedRequests = stats?.approved_count || 0;
  const rejectedRequests = stats?.rejected_count || 0;
  const canceledRequests = stats?.canceled_count || 0;
  const approvalRate = stats?.approval_rate || 0;
  const thisMonthRequests = stats?.current_month_request_count || 0;
  const requestGrowth = stats?.change_rate || 0;
  const averageProcessingDays = stats?.average_processing_days || 0;

  if (isLoadingStats) {
    return (
      <div className='grid grid-cols-2 lg:grid-cols-7 gap-4 mb-8'>
        {[...Array(7)].map((_, i) => (
          <Card key={i} className='animate-pulse'>
            <CardContent className='p-6'>
              <div className='h-20 bg-gray-200 rounded'></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className='grid grid-cols-2 lg:grid-cols-7 gap-4 mb-8'>
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
            <div className='w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center'>
              <Ban className='w-6 h-6 text-gray-600' />
            </div>
            <Badge variant='secondary' className='bg-gray-100 text-gray-800'>
              취소
            </Badge>
          </div>
          <div>
            <p className='text-sm text-gray-600 mb-1'>취소</p>
            <p className='text-2xl font-bold text-gray-600'>{canceledRequests}</p>
            <p className='text-xs text-gray-500 mt-1'>신청 취소됨</p>
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
  );
}
