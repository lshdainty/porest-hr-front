import { useState, useEffect } from 'react'
import { usePostUserInvite } from '@/api/user'
import { Input } from '@/components/shadcn/input'
import { Button } from '@/components/shadcn/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/shadcn/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger } from '@/components/shadcn/dialog'
import { User as UserIcon, Mail, Building2, Clock, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="p-6 space-y-4">
              <FormField
                control={form.control}
                name="user_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이름</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="user_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel><UserIcon className='h-4 w-4 text-muted-foreground inline-block' /> 아이디</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="user_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel><Mail className='h-4 w-4 text-muted-foreground inline-block' /> 이메일</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="user_origin_company_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel><Building2 className='h-4 w-4 text-muted-foreground inline-block' /> 회사</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="회사 선택" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {companyOptions.map(option => <SelectItem key={option.company_type} value={option.company_type}>{option.company_name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="user_work_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel><Clock className='h-4 w-4 text-muted-foreground inline-block' /> 유연근무시간</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className={cn('w-full', selectedWorkTime?.className)}>
                          <SelectValue placeholder="근무 시간 선택" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {workTimeOptions.map(option => <SelectItem key={option.value} value={option.value} className={option.className}>{option.value}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  취소
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    처리 중...
                  </>
                ) : (
                  '초대'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
