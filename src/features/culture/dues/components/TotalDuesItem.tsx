import { GetMonthBirthDuesResp, GetYearOperationDuesResp } from '@/lib/api/dues';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import { BanknoteArrowDown, BanknoteArrowUp, DollarSign, Users } from 'lucide-react';

export interface TotalDuesItemProps {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  amount: number;
  description: string;
  colorClass: string;
  iconBg: string;
}

const TotalDuesItem = ({
  title,
  icon: Icon,
  amount,
  description,
  colorClass,
  iconBg
}: TotalDuesItemProps) => {
  return (
    <div className='flex flex-col h-full justify-between'>
      <div className='flex items-center justify-between mb-4'>
        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', iconBg)}>
          <Icon className={cn('w-5 h-5', colorClass)} />
        </div>
      </div>
      <div>
        <h3 className='text-sm font-medium text-muted-foreground mb-1'>{title}</h3>
        <div className='flex items-baseline gap-1 mb-1'>
          <span className={cn('text-2xl font-bold', colorClass)}>
            {amount.toLocaleString('ko-KR')}
          </span>
          <span className='text-sm text-muted-foreground opacity-60'>원</span>
        </div>
        <p className='text-xs text-muted-foreground opacity-70'>{description}</p>
      </div>
    </div>
  );
};

export const getTotalDuesConfig = (
  totalDues?: GetYearOperationDuesResp,
  birthDues?: GetMonthBirthDuesResp
): TotalDuesItemProps[] => {
  const currentMonth = dayjs().format('MM');

  return [
    {
      id: 'total',
      title: '전체 운영비',
      icon: DollarSign,
      amount: totalDues?.total_dues ?? 0,
      description: '현재 보유한 총 운영비',
      colorClass: 'text-blue-600',
      iconBg: 'bg-blue-100'
    },
    {
      id: 'deposit',
      title: '운영비 입금',
      icon: BanknoteArrowUp,
      amount: totalDues?.total_deposit ?? 0,
      description: '올해 총 입금액',
      colorClass: 'text-green-600',
      iconBg: 'bg-green-100'
    },
    {
      id: 'withdrawal',
      title: '운영비 출금',
      icon: BanknoteArrowDown,
      amount: Math.abs(totalDues?.total_withdrawal ?? 0),
      description: '올해 총 출금액',
      colorClass: 'text-red-600',
      iconBg: 'bg-red-100'
    },
    {
      id: 'birth',
      title: `${currentMonth}월 생일비`,
      icon: Users,
      amount: birthDues?.birth_month_dues ?? 0,
      description: '이번 달 생일비',
      colorClass: 'text-purple-600',
      iconBg: 'bg-purple-100'
    }
  ];
};

export default TotalDuesItem;
