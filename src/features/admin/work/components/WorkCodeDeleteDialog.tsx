import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/shadcn/alertDialog';
import { useDeleteWorkCodeMutation } from '@/hooks/queries/useWorks';
import { WorkCodeResp } from '@/lib/api/work';
import { useTranslation } from 'react-i18next';

interface WorkCodeDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workCode: WorkCodeResp | null;
  onSuccess?: () => void;
}

const WorkCodeDeleteDialog = ({
  open,
  onOpenChange,
  workCode,
  onSuccess
}: WorkCodeDeleteDialogProps) => {
  const { t } = useTranslation('work');
  const { t: tc } = useTranslation('common');
  const { mutate: deleteWorkCode, isPending } = useDeleteWorkCodeMutation();

  const handleDelete = () => {
    if (!workCode) return;

    deleteWorkCode(workCode.work_code_id, {
      onSuccess: () => {
        onOpenChange(false);
        onSuccess?.();
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('codeDelete')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('codeDeleteConfirm', { name: workCode?.work_code_name })}
            <br />
            {t('codeDeleteWarning')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>{tc('cancel')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? tc('deleting') : tc('delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export { WorkCodeDeleteDialog };
