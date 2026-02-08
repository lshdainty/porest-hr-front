import { GetMonthBirthDuesResp, GetYearOperationDuesResp } from '@/entities/dues';
import { cn } from '@/shared/lib'
import dayjs from 'dayjs';
import { BanknoteArrowDown, BanknoteArrowUp, DollarSign, Users } from 'lucide-react';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation('culture');

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
          <span className='text-sm text-muted-foreground opacity-60'>{t('dues.currencyUnit')}</span>
        </div>
        <p className='text-xs text-muted-foreground opacity-70'>{description}</p>
      </div>
    </div>
  );
};

export const getTotalDuesConfig = (
  totalDues: GetYearOperationDuesResp | undefined,
  birthDues: GetMonthBirthDuesResp | undefined,
  t: TFunction<'culture', undefined>
): TotalDuesItemProps[] => {
  const currentMonth = dayjs().format('MM');

  return [
    {
      id: 'total',
      title: t('dues.totalOperationFee'),
      icon: DollarSign,
      amount: totalDues?.total_dues ?? 0,
      description: t('dues.totalOperationFeeDesc'),
      colorClass: 'text-blue-600',
      iconBg: 'bg-blue-100'
    },
    {
      id: 'deposit',
      title: t('dues.operationDeposit'),
      icon: BanknoteArrowUp,
      amount: totalDues?.total_deposit ?? 0,
      description: t('dues.operationDepositDesc'),
      colorClass: 'text-green-600',
      iconBg: 'bg-green-100'
    },
    {
      id: 'withdrawal',
      title: t('dues.operationWithdrawal'),
      icon: BanknoteArrowDown,
      amount: Math.abs(totalDues?.total_withdrawal ?? 0),
      description: t('dues.operationWithdrawalDesc'),
      colorClass: 'text-red-600',
      iconBg: 'bg-red-100'
    },
    {
      id: 'birth',
      title: t('dues.monthBirthFee', { month: currentMonth }),
      icon: Users,
      amount: birthDues?.birth_month_dues ?? 0,
      description: t('dues.monthBirthFeeDesc'),
      colorClass: 'text-purple-600',
      iconBg: 'bg-purple-100'
    }
  ];
};

export { TotalDuesItem };
