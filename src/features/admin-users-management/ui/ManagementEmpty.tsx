import { Button } from '@/shared/ui/shadcn/button'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyIcon, EmptyTitle } from '@/shared/ui/shadcn/empty'
import { useManagementContext } from '@/features/admin-users-management/model/ManagementContext'
import { UserPlus, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface ManagementEmptyProps {
  className?: string
}

const ManagementEmpty = ({ className }: ManagementEmptyProps) => {
  const { t } = useTranslation('admin')
  const { setShowInviteDialog } = useManagementContext()

  return (
    <Empty className={className}>
      <EmptyHeader>
        <EmptyIcon>
          <Users />
        </EmptyIcon>
        <EmptyTitle>{t('user.empty.title')}</EmptyTitle>
        <EmptyDescription>{t('user.empty.description')}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button onClick={() => setShowInviteDialog(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          {t('user.invite')}
        </Button>
      </EmptyContent>
    </Empty>
  )
}

export { ManagementEmpty }
