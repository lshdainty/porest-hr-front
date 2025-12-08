import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card'
import { Progress } from '@/components/shadcn/progress'
import { GetTodayWorkStatusResp } from '@/lib/api/work'
import { cn } from '@/lib/utils'
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface TodayWorkStatusContentProps {
  data: GetTodayWorkStatusResp
}

export const TodayWorkStatusContent = ({ data }: TodayWorkStatusContentProps) => {
  const { t } = useTranslation('dashboard')

  const { total_hours = 0, required_hours = 1, completed = false } = data
  const percentage = Math.min((total_hours / required_hours) * 100, 100)

  return (
    <Card className="h-full flex flex-col border-none shadow-none">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {t('workHistory.title')}
          </CardTitle>
          {completed ? (
            <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-xs font-medium bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
              <CheckCircle2 className="h-3 w-3" />
              <span>{t('workHistory.achieved')}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400 text-xs font-medium bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded-full">
              <AlertCircle className="h-3 w-3" />
              <span>{t('workHistory.inProgress')}</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center gap-4">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-3xl font-bold tracking-tight">
              {total_hours}
            </span>
            <span className="text-sm text-muted-foreground ml-1">
              / {required_hours} {t('workHistory.hoursUnit')}
            </span>
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            {Math.round(percentage)}%
          </span>
        </div>

        <Progress
          value={percentage}
          className={cn(
            "h-2",
            completed ? "[&>div]:bg-green-500" : "[&>div]:bg-orange-500"
          )}
        />

        <p className="text-xs text-muted-foreground">
          {completed
            ? t('workHistory.achievedMessage')
            : t('workHistory.remainingMessage', { hours: Math.max(required_hours - total_hours, 0).toFixed(1) })}
        </p>
      </CardContent>
    </Card>
  )
}
