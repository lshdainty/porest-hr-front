import { useResetPasswordMutation } from '@/entities/user'
import { Button } from '@/shared/ui/shadcn/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/shadcn/dialog'
import { Input } from '@/shared/ui/shadcn/input'
import { Label } from '@/shared/ui/shadcn/label'
import { Spinner } from '@/shared/ui/shadcn/spinner'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface UserPasswordResetDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
  userName: string
}

const UserPasswordResetDialog = ({ open, onOpenChange, userId, userName }: UserPasswordResetDialogProps) => {
  const { t } = useTranslation('admin')
  const { t: tc } = useTranslation('common')
  const { mutateAsync: resetPassword, isPending } = useResetPasswordMutation()
  const [password, setPassword] = useState('')

  const handleConfirm = async () => {
    if (!password.trim()) return
    await resetPassword({ user_id: userId, new_password: password })
    setPassword('')
    onOpenChange(false)
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setPassword('')
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('user.passwordResetTitle')}</DialogTitle>
          <DialogDescription>
            {t('user.passwordResetDesc', { name: userName })}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="password">{t('user.newPassword')}</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('user.newPasswordPlaceholder')}
            className="mt-2"
            disabled={isPending}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary" disabled={isPending}>
              {tc('cancel')}
            </Button>
          </DialogClose>
          <Button onClick={handleConfirm} disabled={isPending || !password.trim()}>
            {isPending ? (
              <>
                <Spinner className="h-4 w-4 mr-2" />
                {t('user.resetting')}
              </>
            ) : (
              t('user.reset')
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { UserPasswordResetDialog }
