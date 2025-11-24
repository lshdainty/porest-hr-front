import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shadcn/card';
import { GetAvailableVacationsResp } from '@/lib/api/vacation';
import { cn } from '@/lib/utils';
import VacationTypeStatsContent from './VacationTypeStatsContent';

interface VacationTypeStatsCardProps {
  value: GetAvailableVacationsResp[] | undefined
  className: string | undefined;
}

const VacationTypeStatsCard = ({ value, className }: VacationTypeStatsCardProps) => {
  return (
    <Card className={cn(className, 'flex flex-col')}>
      <CardHeader className='items-center pb-0 flex-shrink-0'>
        <CardTitle>휴가 유형</CardTitle>
        <CardDescription>잔여 휴가별 휴가 유형</CardDescription>
      </CardHeader>
      <CardContent className='flex-1 pb-4 flex flex-col min-h-[350px]'>
        <VacationTypeStatsContent data={value} />
      </CardContent>
    </Card>
  )
}

export default VacationTypeStatsCard