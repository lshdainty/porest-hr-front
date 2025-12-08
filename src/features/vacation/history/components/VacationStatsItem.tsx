import { Badge } from '@/components/shadcn/badge';
import { GetUserVacationStatsResp } from '@/lib/api/vacation';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';
import { TFunction } from 'i18next';

export interface VacationStatsItemProps {
  id: string;
  title: string;
  value: string;
  changeStr: string;
  changeType: 'increase' | 'decrease' | '';
  description: string;
}

const VacationStatsItem = ({ title, value, changeStr, changeType, description }: VacationStatsItemProps) => {
  return (
    <div className='flex flex-col gap-2'>
      <div className='flex items-center justify-between'>
        <span className='text-sm font-medium text-muted-foreground'>{title}</span>
        {changeType && changeStr && (
          <Badge variant='outline' className={`text-xs ${changeType === 'increase' ? 'text-green-500' : 'text-red-500'}`}>
            {changeType === 'increase' ? (
              <ArrowUpIcon className='h-3 w-3 mr-1' />
            ) : (
              <ArrowDownIcon className='h-3 w-3 mr-1' />
            )}
            {changeStr}
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

/**
 * gap 값이 유효한지 확인 (null, undefined, 0이 아닌지)
 */
const isValidGap = (gap: number | null | undefined): gap is number => {
  return gap !== null && gap !== undefined && gap !== 0;
};

/**
 * gap 값에 따른 changeType 결정
 */
const getChangeType = (gap: number | null | undefined): 'increase' | 'decrease' | '' => {
  if (!isValidGap(gap)) return '';
  return gap > 0 ? 'increase' : 'decrease';
};

export const getVacationStatsConfig = (data: GetUserVacationStatsResp | undefined, t: TFunction<'vacation', undefined>): VacationStatsItemProps[] => {
  if (!data) return [];

  const remainGap = data.remain_time_gap;
  const usedGap = data.used_time_gap;
  const remainChangeType = getChangeType(remainGap);
  const usedChangeType = getChangeType(usedGap);

  return [
    {
      id: 'remain',
      title: t('history.remainVacation'),
      value: `${data.remain_time_str}`,
      changeStr: data.remain_time_gap_str || '',
      changeType: remainChangeType,
      description: isValidGap(remainGap) ? t('history.comparedDesc', { gap: data.remain_time_gap_str, type: remainGap > 0 ? t('history.increase') : t('history.decrease') }) : ''
    },
    {
      id: 'used',
      title: t('history.usedVacation'),
      value: `${data.used_time_str}`,
      changeStr: data.used_time_gap_str || '',
      changeType: usedChangeType,
      description: isValidGap(usedGap) ? t('history.comparedDesc', { gap: data.used_time_gap_str, type: usedGap > 0 ? t('history.increase') : t('history.decrease') }) : ''
    },
    {
      id: 'expect',
      title: t('history.expectedVacation'),
      value: `${data.expect_used_time_str}`,
      changeStr: '',
      changeType: '',
      description: ''
    },
  ];
};

export { VacationStatsItem }
