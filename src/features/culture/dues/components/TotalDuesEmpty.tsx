import { Empty, EmptyDescription, EmptyHeader, EmptyIcon, EmptyTitle } from '@/components/shadcn/empty'
import { cn } from '@/lib/utils'
import { Coins } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface TotalDuesEmptyProps {
  className?: string
}

export const TotalDuesEmpty = ({ className }: TotalDuesEmptyProps) => {
  const { t } = useTranslation('culture')

  return (
    <div className={cn('h-full w-full flex', className)}>
      <Empty>
        <EmptyHeader>
          <EmptyIcon>
            <Coins />
          </EmptyIcon>
          <EmptyTitle>{t('dues.empty.title')}</EmptyTitle>
          <EmptyDescription>
            {t('dues.empty.description')}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  )
}
