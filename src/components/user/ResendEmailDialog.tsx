import { ReactNode, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from '@/components/shadcn/dialog'
import { Button } from '@/components/shadcn/button'
import { usePostResendInvitation } from '@/api/user'
import { Loader2 } from 'lucide-react'

interface ResendEmailDialogProps {
  trigger: ReactNode
  userId: string
  userEmail: string
}

export default function ResendEmailDialog({ trigger, userId, userEmail }: ResendEmailDialogProps) {
  const [open, setOpen] = useState(false)
  const { mutateAsync: resendInvitation, isPending } = usePostResendInvitation()

  const handleConfirm = async () => {
    await resendInvitation(userId)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
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
