import { usePostResendInvitationMutation } from '@/hooks/queries/useUsers'
import { Button } from '@/components/shadcn/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/shadcn/dialog'
import { Loader2 } from 'lucide-react'

interface ResendEmailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
  userEmail: string
}

export default function ResendEmailDialog({ open, onOpenChange, userId, userEmail }: ResendEmailDialogProps) {
  const { mutateAsync: resendInvitation, isPending } = usePostResendInvitationMutation()

  const handleConfirm = async () => {
    await resendInvitation(userId)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>초대 메일 재전송</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            {userEmail}로 초대 메일을 재전송하시겠습니까?
          </p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary" disabled={isPending}>
              취소
            </Button>
          </DialogClose>
          <Button onClick={handleConfirm} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                전송 중...
              </>
            ) : (
              '전송'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
