import { Badge } from '@/components/shadcn/badge';
import { GetUserVacationStatsResp } from '@/lib/api/vacation';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';

export interface VacationStatsItemProps {
  id: string;
  title: string;
  value: string;
  change: number;
  changeType: 'increase' | 'decrease' | '';
  description: string;
}

const VacationStatsItem = ({ title, value, change, changeType, description }: VacationStatsItemProps) => {
  return (
    <div className='flex flex-col gap-2'>
      <div className='flex items-center justify-between'>
        <span className='text-sm font-medium text-muted-foreground'>{title}</span>
        {changeType && (
          <Badge variant='outline' className={`text-xs ${changeType === 'increase' ? 'text-green-500' : 'text-red-500'}`}>
            {changeType === 'increase' ? (
              <ArrowUpIcon className='h-3 w-3 mr-1' />
            ) : (
              <ArrowDownIcon className='h-3 w-3 mr-1' />
            )}
            {Math.abs(change)}
          </Badge>
        )}
      </div>
      <div className='text-2xl font-bold'>{value}</div>
      {description && (
        <p className={`text-xs ${changeType === 'increase' ? 'text-green-500' : changeType === 'decrease' ? 'text-red-500' : 'text-gray-500'}`}>
          {description}
        </p>
      )}
    </div>
  );
};

export const getVacationStatsConfig = (data: GetUserVacationStatsResp | undefined): VacationStatsItemProps[] => {
  if (!data) return [];

  return [
    {
      id: 'remain',
      title: '잔여 휴가',
      value: `${data.remain_time_str}`,
      change: data.remain_time_gap,
      changeType: data.remain_time_gap > 0 ? 'increase' : data.remain_time_gap < 0 ? 'decrease' : '',
      description: data.remain_time_gap !== 0 ? `지난 달 대비 ${data.remain_time_gap_str} ${data.remain_time_gap > 0 ? '증가' : '감소'}` : ''
    },
    {
      id: 'used',
      title: '사용 휴가',
      value: `${data.used_time_str}`,
      change: data.used_time_gap,
      changeType: data.used_time_gap > 0 ? 'increase' : data.used_time_gap < 0 ? 'decrease' : '',
      description: data.used_time_gap !== 0 ? `지난 달 대비 ${data.used_time_gap_str} ${data.used_time_gap > 0 ? '증가' : '감소'}` : ''
    },
    {
      id: 'expect',
      title: '사용 예정 휴가',
      value: `${data.expect_used_time_str}`,
      change: 0,
      changeType: '',
      description: ''
    },
  ];
};

export default VacationStatsItem;
