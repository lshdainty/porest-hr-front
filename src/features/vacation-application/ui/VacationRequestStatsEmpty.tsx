import { Empty, EmptyDescription, EmptyHeader, EmptyIcon, EmptyTitle } from '@/shared/ui/shadcn/empty'
import { cn } from '@/shared/lib'
import { FileText } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface VacationRequestStatsEmptyProps {
  className?: string
}

export const VacationRequestStatsEmpty = ({ className }: VacationRequestStatsEmptyProps) => {
  const { t } = useTranslation('vacation')

  return (
    <div className={cn('h-full w-full flex', className)}>
      <Empty>
        <EmptyHeader>
          <EmptyIcon>
            <FileText />
          </EmptyIcon>
          <EmptyTitle>{t('request.empty.title')}</EmptyTitle>
          <EmptyDescription>{t('request.empty.description')}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  )
}
