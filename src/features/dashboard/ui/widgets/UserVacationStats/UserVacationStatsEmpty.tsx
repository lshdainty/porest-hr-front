import { Card, CardContent } from '@/shared/ui/shadcn/card'
import { Empty, EmptyDescription, EmptyHeader, EmptyIcon, EmptyTitle } from '@/shared/ui/shadcn/empty'
import { BarChart3 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export const UserVacationStatsEmpty = () => {
  const { t } = useTranslation('vacation')

  return (
    <Card className="h-full flex flex-col border-none shadow-none py-0">
      <CardContent className="flex-1 flex items-center justify-center p-0">
        <Empty>
          <EmptyHeader>
            <EmptyIcon>
              <BarChart3 />
            </EmptyIcon>
            <EmptyTitle>{t('history.noDataMessage')}</EmptyTitle>
            <EmptyDescription>
              {t('history.noDataMessageDesc')}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </CardContent>
    </Card>
  )
}
