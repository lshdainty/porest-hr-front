import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shadcn/card';
import { GetAvailableVacationsResp } from '@/lib/api/vacation';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import VacationTypeStatsContent from './VacationTypeStatsContent';

interface VacationTypeStatsCardProps {
  value: GetAvailableVacationsResp | undefined
  className: string | undefined;
}

const VacationTypeStatsCard = ({ value, className }: VacationTypeStatsCardProps) => {
  const { t } = useTranslation('vacation');
  return (
    <Card className={cn(className, 'flex flex-col')}>
      <CardHeader className='items-center pb-0 flex-shrink-0'>
        <CardTitle>{t('history.vacationType')}</CardTitle>
        <CardDescription>{t('history.vacationTypeDesc')}</CardDescription>
      </CardHeader>
      <CardContent className='flex-1 pb-4 flex flex-col min-h-[350px]'>
        <VacationTypeStatsContent data={value} />
      </CardContent>
    </Card>
  )
}

export default VacationTypeStatsCard