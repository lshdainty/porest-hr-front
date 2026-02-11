import { Card, CardContent } from '@/shared/ui/shadcn/card'
import { Empty, EmptyDescription, EmptyHeader, EmptyIcon, EmptyTitle } from '@/shared/ui/shadcn/empty'
import { Monitor } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export const SystemCheckEmpty = () => {
  const { t } = useTranslation('dashboard')

  return (
    <Card className="h-full flex flex-col border-none shadow-none py-0">
      <CardContent className="flex-1 flex items-center justify-center p-0">
        <Empty>
          <EmptyHeader>
            <EmptyIcon>
              <Monitor />
            </EmptyIcon>
            <EmptyTitle>{t('systemCheck.noSystem')}</EmptyTitle>
            <EmptyDescription>
              {t('systemCheck.noSystemDesc')}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </CardContent>
    </Card>
  )
}
