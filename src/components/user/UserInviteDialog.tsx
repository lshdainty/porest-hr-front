import type { TypeResp } from '@/api/type'
import { useGetUserIdDuplicate, usePostUserInvite, usePutInvitedUser } from '@/api/user'
import { Button } from '@/components/shadcn/button'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/shadcn/dialog'
import { Field, FieldError, FieldLabel } from '@/components/shadcn/field'
import { Input } from '@/components/shadcn/input'
import { InputDatePicker } from '@/components/shadcn/inputDatePicker'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'
import { Spinner } from '@/components/shadcn/spinner'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Building2, Calendar, Clock, Mail, User as UserIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
  user_id: z.string().min(1, '아이디를 입력해주세요.'),
  user_name: z.string().min(1, '이름을 입력해주세요.'),
  user_email: z.string().email('유효한 이메일을 입력해주세요.'),
  join_date: z.string().min(1, '입사일을 입력해주세요.'),
  user_origin_company_type: z.string().min(1, '회사를 선택해주세요.'),
  user_work_time: z.string().min(1, '유연근무시간을 선택해주세요.')
})

type UserInviteFormValues = z.infer<typeof formSchema>

interface UserInviteDialogProps {
  trigger: React.ReactNode
  title: string
  companyOptions: TypeResp[]
  initialData?: {
    user_id: string
    user_name: string
    user_email: string
    user_origin_company_type: string
    user_work_time: string
    join_date: string
  }
}

export default function UserInviteDialog({ trigger, title, companyOptions, initialData }: UserInviteDialogProps) {
  const [open, setOpen] = useState(false)
  const [userIdToCheck, setUserIdToCheck] = useState('')
  const { mutateAsync: inviteUser, isPending: isInvitePending } = usePostUserInvite()
  const { mutateAsync: updateInvitedUser, isPending: isUpdatePending } = usePutInvitedUser()

  const isEditMode = !!initialData?.user_id
  const isPending = isInvitePending || isUpdatePending

  const { data: duplicateCheckResult, isLoading: isCheckingDuplicate } = useGetUserIdDuplicate({
    user_id: userIdToCheck
  })

  const form = useForm<UserInviteFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user_id: initialData?.user_id || '',
      user_name: initialData?.user_name || '',
      user_email: initialData?.user_email || '',
      user_origin_company_type: initialData?.user_origin_company_type || companyOptions[0]?.code || '',
      user_work_time: initialData?.user_work_time || '9 ~ 6',
      join_date: initialData?.join_date || ''
    }
  })

  // 중복 체크 결과에 따라 에러 설정
  useEffect(() => {
    if (duplicateCheckResult && userIdToCheck) {
      if (duplicateCheckResult.duplicate) {
        form.setError('user_id', {
          type: 'manual',
          message: '아이디가 중복됩니다.'
        })
      } else {
        form.clearErrors('user_id')
      }
    }
  }, [duplicateCheckResult, userIdToCheck, form])

  const handleUserIdBlur = () => {
    const userId = form.getValues('user_id')

    // 빈 값이면 체크하지 않음
    if (!userId || userId.trim() === '') {
      setUserIdToCheck('')
      return
    }

    // user_id를 설정하면 useGetUserIdDuplicate가 자동으로 호출됨
    setUserIdToCheck(userId)
  }

  const workTimeOptions = [
    { value: '8 ~ 5', className: 'text-rose-500 dark:text-rose-400' },
    { value: '9 ~ 6', className: 'text-sky-500 dark:text-sky-400' },
    { value: '10 ~ 7', className: 'text-emerald-500 dark:text-emerald-400' }
  ]

  const selectedWorkTime = workTimeOptions.find(option => option.value === form.watch('user_work_time'))

  useEffect(() => {
    if (open) {
      form.reset({
        user_id: initialData?.user_id || '',
        user_name: initialData?.user_name || '',
        user_email: initialData?.user_email || '',
        user_origin_company_type: initialData?.user_origin_company_type || companyOptions[0]?.code || '',
        user_work_time: initialData?.user_work_time || '9 ~ 6',
        join_date: initialData?.join_date || ''
      })
      setUserIdToCheck('') // 다이얼로그 열릴 때 중복 체크 상태 초기화
    }
  }, [open, form, companyOptions, initialData])

  const onSubmit = async (values: UserInviteFormValues) => {
    if (isEditMode) {
      // 수정 모드: PUT /users/{id}/invitations
      await updateInvitedUser({
        user_id: values.user_id,
        user_name: values.user_name,
        user_email: values.user_email,
        user_origin_company_type: values.user_origin_company_type,
        user_work_time: values.user_work_time,
        join_date: values.join_date
      })
    } else {
      // 신규 초대 모드: POST /users/invitations
      await inviteUser(values)
    }
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
                  <Input
                    {...field}
                    onBlur={(e) => {
                      field.onBlur()
                      handleUserIdBlur()
                    }}
                    disabled={isCheckingDuplicate || !!initialData?.user_id}
                  />
                  {isCheckingDuplicate && (
                    <div className="text-xs text-muted-foreground mt-1">중복 확인 중...</div>
                  )}
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
              name="join_date"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel>
                    <Calendar className='h-4 w-4 text-muted-foreground inline-block' /> 입사일
                    <span className='text-destructive ml-0.5'>*</span>
                  </FieldLabel>
                  <InputDatePicker
                    value={field.value}
                    onValueChange={field.onChange}
                  />
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
                      {companyOptions.map(option => <SelectItem key={option.code} value={option.code}>{option.name}</SelectItem>)}
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
              {isPending ? '처리 중...' : isEditMode ? '수정' : '초대'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
