import { Card, CardContent, CardHeader } from '@/components/shadcn/card';
import { GetMonthBirthDuesResp, GetYearOperationDuesResp } from '@/lib/api/dues';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import { BanknoteArrowDown, BanknoteArrowUp, DollarSign, Users } from 'lucide-react';

interface TotalDuesProps {
  totalDues?: GetYearOperationDuesResp;
  birthDues?: GetMonthBirthDuesResp;
}

interface BigNumberCardProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  amount: number;
  description: string;
  colorClass: string;
}

const BigNumberCard = ({
  title,
  icon: Icon,
  amount,
  description,
  colorClass
}: BigNumberCardProps) => {
  return (
    <Card className='relative overflow-hidden'>
      <CardHeader className='pb-2'>
        <div className='flex items-center gap-2'>
          <Icon className={cn('w-5 h-5', colorClass)} />
          <h3 className='text-sm font-medium text-card-foreground'>{title}</h3>
        </div>
      </CardHeader>
      <CardContent>
        <div className='flex items-baseline gap-1 mb-2'>
          <span className={cn('text-3xl font-bold', colorClass)}>
            {amount.toLocaleString('ko-KR')}
          </span>
          <span className='text-lg text-card-foreground opacity-60'>원</span>
        </div>
        <p className='text-xs text-card-foreground opacity-70'>{description}</p>
      </CardContent>
      <div className='absolute bottom-0 right-0 w-16 h-16 opacity-10'>
        <Icon className='w-full h-full p-3' />
      </div>
    </Card>
  );
};

const TotalDues = ({ totalDues, birthDues }: TotalDuesProps) => {
  const currentMonth = dayjs().format('MM');

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
      <BigNumberCard
        title='전체 운영비'
        icon={DollarSign}
        amount={totalDues?.total_dues ?? 0}
        description='현재 보유한 총 운영비'
        colorClass='text-blue-600'
      />
      <BigNumberCard
        title='운영비 입금'
        icon={BanknoteArrowUp}
        amount={totalDues?.total_deposit ?? 0}
        description='올해 총 입금액'
        colorClass='text-green-600'
      />
      <BigNumberCard
        title='운영비 출금'
        icon={BanknoteArrowDown}
        amount={Math.abs(totalDues?.total_withdrawal ?? 0)}
        description='올해 총 출금액'
        colorClass='text-red-600'
      />
      <BigNumberCard
        title={`${currentMonth}월 생일비`}
        icon={Users}
        amount={birthDues?.birth_month_dues ?? 0}
        description='이번 달 생일비'
        colorClass='text-purple-600'
      />
    </div>
  );
};

export default TotalDues;