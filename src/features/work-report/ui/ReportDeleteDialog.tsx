import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/shadcn/alertDialog'
import { Spinner } from '@/shared/ui/shadcn/spinner'
import { WorkHistory } from '@/features/work-report/model/types'
import { useTranslation } from 'react-i18next'

interface ReportDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workHistory: WorkHistory | null
  onConfirm: () => void
  isPending: boolean
}

const ReportDeleteDialog = ({
  open,
  onOpenChange,
  workHistory,
  onConfirm,
  isPending,
}: ReportDeleteDialogProps) => {
  const { t } = useTranslation('work')
  const { t: tc } = useTranslation('common')

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('report.deleteTitle')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('report.deleteConfirm', { date: workHistory?.date })}
            <br />
            {t('report.deleteWarning')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>{tc('cancel')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              onConfirm()
            }}
            disabled={isPending}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {isPending && <Spinner className="mr-2" />}
            {isPending ? tc('deleting') : tc('delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export { ReportDeleteDialog }
