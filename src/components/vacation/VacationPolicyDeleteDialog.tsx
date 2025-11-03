import { useDeleteVacationPolicy, type GetVacationPoliciesResp } from '@/api/vacation'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/shadcn/alertDialog'
import { TriangleAlert } from 'lucide-react'

interface VacationPolicyDeleteDialogProps {
  policy: GetVacationPoliciesResp
  trigger: React.ReactNode
}

export function VacationPolicyDeleteDialog({
  policy,
  trigger
}: VacationPolicyDeleteDialogProps) {
  const deleteVacationPolicy = useDeleteVacationPolicy()

  const handleDelete = async () => {
    if (policy?.vacation_policy_id) {
      try {
        await deleteVacationPolicy.mutateAsync(policy.vacation_policy_id)
      } catch (error) {
        console.error('휴가 정책 삭제 실패:', error)
      }
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-lg">
        <div className="flex items-start space-x-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <TriangleAlert className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <AlertDialogHeader className="flex-1">
            <AlertDialogTitle>휴가 정책 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              정말 '{policy.vacation_policy_name}' 휴가 정책을 삭제하시겠습니까?
              <br />
              기존에 부여된 휴가나 사용 내역은 삭제되지 않지만, 더 이상 새로운 휴가가 부여되지 않습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteVacationPolicy.isPending}
          >
            {deleteVacationPolicy.isPending ? '삭제 중...' : '삭제'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
