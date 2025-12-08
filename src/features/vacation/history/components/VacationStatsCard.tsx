import { Card, CardContent } from '@/components/shadcn/card'
import { VacationStatsEmpty } from '@/features/vacation/history/components/VacationStatsEmpty'
import type { GetUserVacationStatsResp } from '@/lib/api/vacation'
import { useTranslation } from 'react-i18next'
import { VacationStatsItem, getVacationStatsConfig } from './VacationStatsItem'

interface VacationStatsCardProps {
  value: GetUserVacationStatsResp | undefined
}

const VacationStatsCard = ({ value: data }: VacationStatsCardProps) => {
  const { t } = useTranslation('vacation')

  if (!data) {
    return <VacationStatsEmpty />
  }

  const vacationStats = getVacationStatsConfig(data, t);

  return (
    <div className='flex flex-wrap gap-6'>
      {vacationStats.map((stat) => (
        <Card key={stat.id} className='flex-1 min-w-80'>
          <CardContent>
            <VacationStatsItem {...stat} />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export { VacationStatsCard }