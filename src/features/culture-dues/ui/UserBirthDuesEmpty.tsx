import { Empty, EmptyDescription, EmptyHeader, EmptyIcon, EmptyTitle } from '@/shared/ui/shadcn/empty'
import { cn } from '@/shared/lib'
import { Gift } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface UserBirthDuesEmptyProps {
  className?: string
}

export const UserBirthDuesEmpty = ({ className }: UserBirthDuesEmptyProps) => {
  const { t } = useTranslation('culture')

  return (
    <div className={cn('h-full w-full flex', className)}>
      <Empty>
        <EmptyHeader>
          <EmptyIcon>
            <Gift />
          </EmptyIcon>
          <EmptyTitle>{t('birthDues.empty.title')}</EmptyTitle>
          <EmptyDescription>{t('birthDues.empty.description')}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  )
}
