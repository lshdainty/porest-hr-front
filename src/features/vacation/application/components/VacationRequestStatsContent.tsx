import { Badge } from '@/components/shadcn/badge';
import { Card, CardContent } from '@/components/shadcn/card';
import { Progress } from '@/components/shadcn/progress';
import { GetUserRequestedVacationStatsResp } from '@/lib/api/vacation';
import { VACATION_STATUS_CONFIG } from '@/utils/vacationStatus';
import {
    CalendarDays,
    FileText,
    TrendingUp
} from 'lucide-react';

interface VacationRequestStatsContentProps {
  stats: GetUserRequestedVacationStatsResp | undefined;
}

const VacationRequestStatsContent = ({ stats }: VacationRequestStatsContentProps) => {
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

  const cardConfig = [
    {
      id: 'total',
      icon: <FileText className='w-6 h-6 text-blue-600' />,
      iconBg: 'bg-blue-100',
      headerRight: (
        <div className='flex items-center gap-1 text-xs'>
          <TrendingUp className='w-3 h-3 text-green-600' />
          <span className='text-green-600 font-medium'>+{requestGrowth.toFixed(1)}%</span>
        </div>
      ),
      title: '총 신청',
      value: totalRequests,
      description: `이번 달 ${thisMonthRequests}건`
    },
    {
      id: 'canceled',
      icon: <VACATION_STATUS_CONFIG.CANCELED.icon className='w-6 h-6 text-foreground' />,
      iconBg: 'bg-muted',
      headerRight: (
        <Badge variant='secondary'>
          취소
        </Badge>
      ),
      title: '취소',
      value: canceledRequests,
      description: '신청 취소됨'
    },
    {
      id: 'pending',
      icon: <VACATION_STATUS_CONFIG.PENDING.icon className='w-6 h-6 text-yellow-600' />,
      iconBg: 'bg-yellow-100',
      headerRight: (
        <Badge variant='secondary' className='bg-yellow-100 text-yellow-800'>
          대기
        </Badge>
      ),
      title: '대기',
      value: pendingRequests,
      description: `평균 처리시간 ${averageProcessingDays.toFixed(1)}일`
    },
    {
      id: 'progress',
      icon: <VACATION_STATUS_CONFIG.PROGRESS.icon className='w-6 h-6 text-blue-600' />,
      iconBg: 'bg-blue-100',
      headerRight: (
        <Badge variant='secondary' className='bg-blue-100 text-blue-800'>
          진행
        </Badge>
      ),
      title: '진행',
      value: inProgressRequests,
      description: '처리중인 요청'
    },
    {
      id: 'approved',
      icon: <VACATION_STATUS_CONFIG.APPROVED.icon className='w-6 h-6 text-green-600' />,
      iconBg: 'bg-green-100',
      headerRight: (
        <div className='text-right'>
          <p className='text-xs text-foreground/70'>승인율</p>
          <p className='text-sm font-semibold text-foreground'>{approvalRate.toFixed(0)}%</p>
        </div>
      ),
      title: '승인',
      value: approvedRequests,
      footer: (
        <div className='mt-2'>
          <Progress value={approvalRate} className='h-2' />
        </div>
      )
    },
    {
      id: 'rejected',
      icon: <VACATION_STATUS_CONFIG.REJECTED.icon className='w-6 h-6 text-red-600' />,
      iconBg: 'bg-red-100',
      headerRight: (
        <Badge variant='secondary' className='bg-red-100 text-red-800'>
          반려
        </Badge>
      ),
      title: '반려',
      value: rejectedRequests,
      description: '재신청 필요'
    },
    {
      id: 'acquired',
      icon: <CalendarDays className='w-6 h-6 text-purple-600' />,
      iconBg: 'bg-purple-100',
      title: '획득 휴가',
      value: stats?.acquired_vacation_time_str || '0일',
      description: '승인된 휴가'
    }
  ];

  return (
    <div className='grid grid-cols-2 lg:grid-cols-7 gap-4 mb-8'>
      {cardConfig.map((card) => (
        <Card key={card.id} className='relative overflow-hidden py-0'>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between mb-4'>
              <div className={`w-12 h-12 rounded-lg ${card.iconBg} flex items-center justify-center`}>
                {card.icon}
              </div>
              {card.headerRight}
            </div>
            <div>
              <p className='text-sm text-foreground mb-1'>{card.title}</p>
              <p className='text-2xl font-bold text-foreground'>{card.value}</p>
              {card.description && (
                <p className='text-xs text-foreground/70 mt-1'>{card.description}</p>
              )}
              {card.footer}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default VacationRequestStatsContent;
