import { Empty, EmptyDescription, EmptyHeader, EmptyIcon, EmptyTitle } from '@/components/shadcn/empty'
import { cn } from '@/lib/utils'
import { Building2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface UserCompanyStatsEmptyProps {
  className?: string
}

export const UserCompanyStatsEmpty = ({ className }: UserCompanyStatsEmptyProps) => {
  const { t } = useTranslation('admin')

  return (
    <div className={cn('h-full w-full flex', className)}>
      <Empty>
        <EmptyHeader>
          <EmptyIcon>
            <Building2 />
          </EmptyIcon>
          <EmptyTitle>{t('user.companyStats.empty.title')}</EmptyTitle>
          <EmptyDescription>{t('user.companyStats.empty.description')}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  )
}
