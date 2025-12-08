import { Card, CardContent } from '@/components/shadcn/card'
import type { GetUserVacationStatsResp } from '@/lib/api/vacation'
import { useTranslation } from 'react-i18next'
import { VacationStatsItem, getVacationStatsConfig } from './VacationStatsItem'

const defaultVacationStats: GetUserVacationStatsResp = {
  remain_time: 0,
  remain_time_str: '0시간',
  used_time: 0,
  used_time_str: '0시간',
  expect_used_time: 0,
  expect_used_time_str: '0시간',
  prev_remain_time: 0,
  prev_remain_time_str: '0시간',
  prev_used_time: 0,
  prev_used_time_str: '0시간',
  prev_expect_used_time: 0,
  prev_expect_used_time_str: '0시간',
  remain_time_gap: 0,
  remain_time_gap_str: '0시간',
  used_time_gap: 0,
  used_time_gap_str: '0시간',
}

interface VacationStatsCardProps {
  value: GetUserVacationStatsResp | undefined
}

const VacationStatsCard = ({ value: data }: VacationStatsCardProps) => {
  const { t } = useTranslation('vacation')

  const vacationStats = getVacationStatsConfig(data || defaultVacationStats, t);

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