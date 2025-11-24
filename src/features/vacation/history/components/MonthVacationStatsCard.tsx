import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card';
import type { GetUserMonthlyVacationStatsResp } from '@/lib/api/vacation';
import { cn } from '@/lib/utils';
import MonthVacationStatsContent from './MonthVacationStatsContent';

interface MonthVacationStatsCardProps {
  value: GetUserMonthlyVacationStatsResp[] | undefined
  className: string | undefined;
}

const MonthVacationStatsCard = ({ value: data, className }: MonthVacationStatsCardProps) => {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>월별 휴가 사용 추이</CardTitle>
      </CardHeader>
      <CardContent>
        <MonthVacationStatsContent data={data} className='h-[350px]' />
      </CardContent>
    </Card>
  )
}

export default MonthVacationStatsCard