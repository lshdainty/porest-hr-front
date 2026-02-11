import { Empty, EmptyDescription, EmptyHeader, EmptyIcon, EmptyTitle } from '@/shared/ui/shadcn/empty'
import { Building2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface DepartmentEmptyProps {
  className?: string
}

const DepartmentEmpty = ({ className }: DepartmentEmptyProps) => {
  const { t } = useTranslation('admin')

  return (
    <Empty className={className}>
      <EmptyHeader>
        <EmptyIcon>
          <Building2 />
        </EmptyIcon>
        <EmptyTitle>{t('department.empty.title')}</EmptyTitle>
        <EmptyDescription>{t('department.empty.description')}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}

export { DepartmentEmpty }
