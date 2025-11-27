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
  const { mutate: deleteWorkCode, isPending } = useDeleteWorkCodeMutation();

  const handleDelete = () => {
    if (!workCode) return;

    deleteWorkCode(workCode.work_code_seq, {
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
          <AlertDialogTitle>업무 코드 삭제</AlertDialogTitle>
          <AlertDialogDescription>
            정말로 '{workCode?.work_code_name}' 업무 코드를 삭제하시겠습니까?
            <br />
            삭제된 코드는 복구할 수 없습니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>취소</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? '삭제 중...' : '삭제'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default WorkCodeDeleteDialog;
