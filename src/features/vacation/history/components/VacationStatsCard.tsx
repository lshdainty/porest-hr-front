import type { GetUserVacationStatsResp } from '@/lib/api/vacation';
import { Badge } from '@/components/shadcn/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

interface VacationStatsCardProps {
  value: GetUserVacationStatsResp | undefined
}

const VacationStatsCard = ({ value: data }: VacationStatsCardProps) => {
  if (!data) {
    return null;
  }

  const vacationStats = [
    {
      title: '잔여 휴가',
      value: `${data.remain_time_str}`,
      change: data.remain_time_gap,
      changeType: data.remain_time_gap > 0 ? 'increase' : data.remain_time_gap < 0 ? 'decrease' : '',
      description: data.remain_time_gap !== 0 ? `지난 달 대비 ${data.remain_time_gap_str} ${data.remain_time_gap > 0 ? '증가' : '감소'}` : ''
    },
    {
      title: '사용 휴가',
      value: `${data.used_time_str}`,
      change: data.used_time_gap,
      changeType: data.used_time_gap > 0 ? 'increase' : data.used_time_gap < 0 ? 'decrease' : '',
      description: data.used_time_gap !== 0 ? `지난 달 대비 ${data.used_time_gap_str} ${data.used_time_gap > 0 ? '증가' : '감소'}` : ''
    },
    {
      title: '사용 예정 휴가',
      value: `${data.expect_used_time_str}`,
      change: 0,
      changeType: '',
      description: ''
    },
  ];
  return (
    <div className='flex flex-wrap gap-6'>
      {vacationStats.map((stat, index) => (
        <Card key={index} className='flex-1 min-w-80'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-1'>
            <CardTitle className='text-sm font-medium'>{stat.title}</CardTitle>
            {stat.changeType && (
              <Badge variant='outline' className={`text-xs ${stat.changeType === 'increase' ? 'text-green-500' : 'text-red-500'}`}>
                {stat.changeType === 'increase' ? (
                  <ArrowUpIcon className='h-3 w-3 mr-1' />
                ) : (
                  <ArrowDownIcon className='h-3 w-3 mr-1' />
                )}
                {Math.abs(stat.change)}
              </Badge>
            )}
          </CardHeader>
          <CardContent className='py-0'>
            <div className='text-2xl font-bold'>{stat.value}</div>
            {stat.description && (
              <p className={`text-xs ${stat.changeType === 'increase' ? 'text-green-500' : stat.changeType === 'decrease' ? 'text-red-500' : 'text-gray-500'}`}>
                {stat.description}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default VacationStatsCard