import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card'
import { MonthVacationStatsContent } from '@/features/vacation/history/components/MonthVacationStatsContent'
import type { GetUserMonthlyVacationStatsResp } from '@/lib/api/vacation'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'

interface MonthVacationStatsCardProps {
  value: GetUserMonthlyVacationStatsResp[] | undefined
  className: string | undefined;
}

const MonthVacationStatsCard = ({ value: data, className }: MonthVacationStatsCardProps) => {
  const { t } = useTranslation('vacation');
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>{t('history.monthlyUsageTrend')}</CardTitle>
      </CardHeader>
      <CardContent>
        <MonthVacationStatsContent data={data} className='h-[350px]' />
      </CardContent>
    </Card>
  )
}

export default MonthVacationStatsCard