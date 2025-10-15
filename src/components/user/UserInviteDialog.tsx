import { useState, useEffect } from 'react'
import { usePostUserInvite } from '@/api/user'
import { Input } from '@/components/shadcn/input'
import { Button } from '@/components/shadcn/button'
import { Field, FieldLabel, FieldError } from '@/components/shadcn/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger } from '@/components/shadcn/dialog'
import { Spinner } from '@/components/shadcn/spinner'
import { User as UserIcon, Mail, Building2, Clock } from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { companyOptions } from '@/lib/constants'
import { cn } from '@/lib/utils'

const formSchema = z.object({
  user_id: z.string().min(1, '아이디를 입력해주세요.'),
  user_name: z.string().min(1, '이름을 입력해주세요.'),
  user_email: z.string().email('유효한 이메일을 입력해주세요.'),
  user_origin_company_type: z.string().min(1, '회사를 선택해주세요.'),
  user_work_time: z.string().min(1, '유연근무시간을 선택해주세요.')
})

type UserInviteFormValues = z.infer<typeof formSchema>

interface UserInviteDialogProps {
  trigger: React.ReactNode
  title: string
}

export default function UserInviteDialog({ trigger, title }: UserInviteDialogProps) {
  const [open, setOpen] = useState(false)
  const { mutateAsync: inviteUser, isPending } = usePostUserInvite()

  const form = useForm<UserInviteFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user_id: '',
      user_name: '',
      user_email: '',
      user_origin_company_type: companyOptions[0].company_type,
      user_work_time: '9 ~ 6'
    }
  })

  const workTimeOptions = [
    { value: '8 ~ 5', className: 'text-rose-500 dark:text-rose-400' },
    { value: '9 ~ 6', className: 'text-sky-500 dark:text-sky-400' },
    { value: '10 ~ 7', className: 'text-emerald-500 dark:text-emerald-400' }
  ]

  const selectedWorkTime = workTimeOptions.find(option => option.value === form.watch('user_work_time'))

  useEffect(() => {
    if (open) {
      form.reset({
        user_id: '',
        user_name: '',
        user_email: '',
        user_origin_company_type: companyOptions[0].company_type,
        user_work_time: '9 ~ 6'
      })
    }
  }, [open, form])

  const onSubmit = async (values: UserInviteFormValues) => {
    await inviteUser(values)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="p-6 space-y-4">
            <Controller
              control={form.control}
              name="user_name"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel>
                    이름
                    <span className='text-destructive ml-0.5'>*</span>
                  </FieldLabel>
                  <Input {...field} />
                  <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="user_id"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel>
                    <UserIcon className='h-4 w-4 text-muted-foreground inline-block' /> 아이디
                    <span className='text-destructive ml-0.5'>*</span>
                  </FieldLabel>
                  <Input {...field} />
                  <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="user_email"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel>
                    <Mail className='h-4 w-4 text-muted-foreground inline-block' /> 이메일
                    <span className='text-destructive ml-0.5'>*</span>
                  </FieldLabel>
                  <Input {...field} />
                  <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="user_origin_company_type"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel>
                    <Building2 className='h-4 w-4 text-muted-foreground inline-block' /> 회사
                    <span className='text-destructive ml-0.5'>*</span>
                  </FieldLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="회사 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {companyOptions.map(option => <SelectItem key={option.company_type} value={option.company_type}>{option.company_name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="user_work_time"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel>
                    <Clock className='h-4 w-4 text-muted-foreground inline-block' /> 유연근무시간
                    <span className='text-destructive ml-0.5'>*</span>
                  </FieldLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className={cn('w-full', selectedWorkTime?.className)}>
                      <SelectValue placeholder="근무 시간 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {workTimeOptions.map(option => <SelectItem key={option.value} value={option.value} className={option.className}>{option.value}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                </Field>
              )}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                취소
              </Button>
            </DialogClose>
            <Button type="submit" disabled={!form.formState.isValid || isPending}>
              {isPending && <Spinner />}
              {isPending ? '처리 중...' : '초대'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
