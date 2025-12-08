import { Empty, EmptyDescription, EmptyHeader, EmptyIcon, EmptyTitle } from '@/components/shadcn/empty'
import { CalendarX, Gift } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface VacationHistoryEmptyProps {
  type?: 'usage' | 'grant'
  className?: string
}

export const VacationHistoryEmpty = ({ type = 'usage', className }: VacationHistoryEmptyProps) => {
  const { t } = useTranslation('vacation')

  const config = {
    usage: {
      icon: <CalendarX />,
      title: t('history.noUsageTitle'),
      description: t('history.noUsageDesc')
    },
    grant: {
      icon: <Gift />,
      title: t('history.noGrantTitle'),
      description: t('history.noGrantDesc')
    }
  }

  const { icon, title, description } = config[type]

  return (
    <Empty className={className}>
      <EmptyHeader>
        <EmptyIcon>
          {icon}
        </EmptyIcon>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>
          {description}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
