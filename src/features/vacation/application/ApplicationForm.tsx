import type { GetUserVacationPoliciesResp } from '@/api/vacation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/avatar'
import { Badge } from '@/components/shadcn/badge'
import { Button } from '@/components/shadcn/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/shadcn/dialog'
import { Field, FieldError, FieldLabel } from '@/components/shadcn/field'
import { Input } from '@/components/shadcn/input'
import { InputDatePicker } from '@/components/shadcn/inputDatePicker'
import { InputTimePicker } from '@/components/shadcn/inputTimePicker'
import { ScrollArea } from '@/components/shadcn/scrollArea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/select'
import { Separator } from '@/components/shadcn/separator'
import { Textarea } from '@/components/shadcn/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'
import { AlertCircle, Calendar, CheckCircle2, Clock, Users } from 'lucide-react'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
  vacationPolicyId: z.number().min(1, '휴가 정책을 선택해주세요.'),
  title: z.string().min(1, '제목을 입력해주세요.'),
  overtimeDate: z.string().min(1, '날짜를 선택해주세요.'),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  reason: z.string().min(1, '사유를 입력해주세요.'),
  approver: z.string().min(1, '결재자를 선택해주세요.'),
}).superRefine((data, ctx) => {
  // overtime 타입인 경우 시작시간, 종료시간 필수
  // 이 검증은 컴포넌트에서 vacation_type을 확인한 후에 수행됩니다
})

type OvertimeFormValues = z.infer<typeof formSchema>

const approvers = [
  { id: 'kim', name: '김팀장', department: 'IT팀', avatar: '/api/placeholder/32/32' },
  { id: 'lee', name: '이부장', department: 'IT부', avatar: '/api/placeholder/32/32' },
  { id: 'park', name: '박차장', department: 'IT부', avatar: '/api/placeholder/32/32' }
]

interface ApplicationFormDialogProps {
  open: boolean
  onClose: () => void
  onSubmitSuccess: () => void
  vacationPolicies: GetUserVacationPoliciesResp[]
}

export default function ApplicationFormDialog({ open, onClose, onSubmitSuccess, vacationPolicies }: ApplicationFormDialogProps) {
  const form = useForm<OvertimeFormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      vacationPolicyId: 0,
      title: '',
      overtimeDate: '',
      startTime: '',
      endTime: '',
      reason: '',
      approver: ''
    }
  })

  const vacationPolicyId = form.watch('vacationPolicyId')
  const startTime = form.watch('startTime')
  const endTime = form.watch('endTime')

  // 선택된 정책 찾기
  const selectedPolicy = vacationPolicies.find(
    policy => policy.vacation_policy_id === vacationPolicyId
  )

  // overtime 타입인지 확인 (대소문자 무관하게 체크)
  const isOvertimeType = selectedPolicy?.vacation_type?.toLowerCase() === 'overtime'

  // 정책 변경 시 날짜와 시간 필드 초기화
  useEffect(() => {
    if (vacationPolicyId) {
      form.setValue('overtimeDate', '')
      form.setValue('startTime', '')
      form.setValue('endTime', '')
    }
  }, [vacationPolicyId, form])

  const calculateHours = (start: string, end: string): number => {
    if (start && end) {
      const startDate = dayjs(`2025-01-01 ${start}`)
      const endDate = dayjs(`2025-01-01 ${end}`)
      // 분은 버리고 시간만 반환 (Math.floor 사용)
      const hours = endDate.diff(startDate, 'hour')
      return hours > 0 ? hours : 0
    }
    return 0
  }

  const overtimeHours = calculateHours(startTime || '', endTime || '')

  useEffect(() => {
    if (open) {
      form.reset({
        vacationPolicyId: 0,
        title: '',
        overtimeDate: '',
        startTime: '',
        endTime: '',
        reason: '',
        approver: ''
      })
    }
  }, [open, form])

  const onSubmit = (values: OvertimeFormValues) => {
    // 제출 로직
    console.log('Form submitted:', {
      ...values,
      overtimeHours,
      compensationHours: overtimeHours
    })

    onSubmitSuccess()
    onClose()
  }

  const handleClose = () => {
    form.reset()
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='max-w-6xl max-h-[90vh] p-0 grid grid-rows-[auto_1fr_auto]'>
        <DialogHeader className='p-6 pb-4'>
          <div>
            <DialogTitle className='text-2xl font-bold'>
              {isOvertimeType ? '보상휴가 신청' : '휴가 신청'}
            </DialogTitle>
            <DialogDescription className='mt-2'>
              {dayjs().format('YYYY년 M월 D일 (ddd) 오후 HH:mm')} 작성
            </DialogDescription>
          </div>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className='contents'>
          <ScrollArea>
            <div className='p-6 pt-0'>
              <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                {/* 메인 폼 */}
                <div className='lg:col-span-2'>
                  <Card>
                    <CardHeader>
                      <div className='flex items-center gap-2'>
                        <Calendar className='w-5 h-5 text-blue-600' />
                        <CardTitle>
                          {isOvertimeType ? '보상휴가 신청 정보' : '휴가 신청 정보'}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className='space-y-6'>
                      <Controller
                        control={form.control}
                        name='title'
                        render={({ field, fieldState }) => (
                          <Field data-invalid={!!fieldState.error}>
                            <FieldLabel>
                              제목
                              <span className='text-destructive ml-0.5'>*</span>
                            </FieldLabel>
                            <Input
                              {...field}
                              placeholder={
                                isOvertimeType
                                  ? '예: 프로젝트 마감 초과근무'
                                  : '예: 개인 사유'
                              }
                            />
                            <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                          </Field>
                        )}
                      />

                      <Controller
                        control={form.control}
                        name='vacationPolicyId'
                        render={({ field, fieldState }) => (
                          <Field data-invalid={!!fieldState.error}>
                            <FieldLabel>
                              휴가 정책
                              <span className='text-destructive ml-0.5'>*</span>
                            </FieldLabel>
                            <Select
                              value={field.value ? field.value.toString() : ''}
                              onValueChange={(value) => field.onChange(parseInt(value))}
                            >
                              <SelectTrigger>
                                {selectedPolicy ? (
                                  <span className='font-medium'>
                                    {selectedPolicy.vacation_policy_name} ({selectedPolicy.grant_time_str})
                                  </span>
                                ) : (
                                  <span className='text-muted-foreground'>휴가 정책을 선택해주세요</span>
                                )}
                              </SelectTrigger>
                              <SelectContent>
                                {vacationPolicies.map((policy) => (
                                  <SelectItem
                                    key={policy.vacation_policy_id}
                                    value={policy.vacation_policy_id.toString()}
                                  >
                                    <div className='flex flex-col'>
                                      <div className='font-medium'>{policy.vacation_policy_name}</div>
                                      <div className='text-xs text-gray-500'>
                                        {policy.vacation_policy_desc} · {policy.grant_time_str}
                                      </div>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                          </Field>
                        )}
                      />

                      {isOvertimeType ? (
                        <>
                          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                            <Controller
                              control={form.control}
                              name='overtimeDate'
                              render={({ field, fieldState }) => (
                                <Field data-invalid={!!fieldState.error}>
                                  <FieldLabel>
                                    초과근무일
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
                              name='startTime'
                              render={({ field, fieldState }) => (
                                <Field data-invalid={!!fieldState.error}>
                                  <FieldLabel>
                                    시작 시간
                                    <span className='text-destructive ml-0.5'>*</span>
                                  </FieldLabel>
                                  <InputTimePicker
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    placeholder="HH:mm"
                                  />
                                  <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                                </Field>
                              )}
                            />
                            <Controller
                              control={form.control}
                              name='endTime'
                              render={({ field, fieldState }) => (
                                <Field data-invalid={!!fieldState.error}>
                                  <FieldLabel>
                                    종료 시간
                                    <span className='text-destructive ml-0.5'>*</span>
                                  </FieldLabel>
                                  <InputTimePicker
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    placeholder="HH:mm"
                                  />
                                  <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                                </Field>
                              )}
                            />
                          </div>

                          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div className='space-y-2'>
                              <FieldLabel>초과근무 시간</FieldLabel>
                              <div className='h-9 px-3 border rounded-md flex items-center bg-gray-50'>
                                <Clock className='w-4 h-4 text-gray-400 mr-2' />
                                <span className='font-semibold'>
                                  {overtimeHours > 0 ? `${overtimeHours}시간` : '-'}
                                </span>
                              </div>
                            </div>
                            <div className='space-y-2'>
                              <FieldLabel>예상 보상 시간</FieldLabel>
                              <div className='h-9 px-3 border rounded-md flex items-center bg-gray-50'>
                                <span className='text-lg font-bold text-blue-600'>
                                  {overtimeHours > 0 ? `${overtimeHours}시간` : '-'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <Controller
                          control={form.control}
                          name='overtimeDate'
                          render={({ field, fieldState }) => (
                            <Field data-invalid={!!fieldState.error}>
                              <FieldLabel>
                                날짜
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
                      )}

                      <Controller
                        control={form.control}
                        name='reason'
                        render={({ field, fieldState }) => (
                          <Field data-invalid={!!fieldState.error}>
                            <FieldLabel>
                              {isOvertimeType ? '초과근무 사유' : '휴가 사유'}
                              <span className='text-destructive ml-0.5'>*</span>
                            </FieldLabel>
                            <Textarea
                              {...field}
                              rows={4}
                              placeholder={
                                isOvertimeType
                                  ? '초과근무를 하게 된 사유를 상세히 기입해 주세요.'
                                  : '휴가 사용 사유를 상세히 기입해 주세요.'
                              }
                            />
                            <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                          </Field>
                        )}
                      />

                      <Controller
                        control={form.control}
                        name='approver'
                        render={({ field, fieldState }) => (
                          <Field data-invalid={!!fieldState.error}>
                            <FieldLabel>
                              결재자 선택
                              <span className='text-destructive ml-0.5'>*</span>
                            </FieldLabel>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger>
                                <SelectValue placeholder='결재자를 선택해주세요' />
                              </SelectTrigger>
                              <SelectContent>
                                {approvers.map((approver) => (
                                  <SelectItem key={approver.id} value={approver.id}>
                                    <div className='flex items-center gap-2'>
                                      <Avatar className='w-6 h-6'>
                                        <AvatarImage src={approver.avatar} />
                                        <AvatarFallback>{approver.name.charAt(0)}</AvatarFallback>
                                      </Avatar>
                                      <div className='text-left'>
                                        <div className='font-medium'>{approver.name}</div>
                                        <div className='text-xs text-gray-500'>{approver.department}</div>
                                      </div>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                          </Field>
                        )}
                      />
                    </CardContent>
                  </Card>
                </div>

                {/* 사이드바 */}
                <div className='lg:col-span-1 space-y-4'>
                  {/* 승인 현황 */}
                  <Card>
                    <CardHeader>
                      <CardTitle className='text-lg flex items-center gap-2'>
                        <Users className='w-5 h-5' />
                        승인 · 참조
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className='space-y-4'>
                        <div>
                          <h4 className='text-sm font-medium text-gray-700 mb-2'>참조</h4>
                          <div className='space-y-2'>
                            <div className='flex items-center gap-2 p-2 rounded-md bg-gray-50'>
                              <Avatar className='w-8 h-8'>
                                <AvatarFallback>송</AvatarFallback>
                              </Avatar>
                              <div className='flex-1'>
                                <div className='text-sm font-medium'>송윤호</div>
                                <div className='text-xs text-gray-500'>Brand & Comm Team</div>
                              </div>
                              <Badge variant='secondary' className='bg-green-100 text-green-800'>
                                승인
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <h4 className='text-sm font-medium text-gray-700 mb-2'>1단계 진행 중</h4>
                          <div className='space-y-2'>
                            <div className='flex items-center gap-2 p-2 rounded-md bg-blue-50'>
                              <Avatar className='w-8 h-8'>
                                <AvatarFallback>이</AvatarFallback>
                              </Avatar>
                              <div className='flex-1'>
                                <div className='text-sm font-medium'>이민서</div>
                                <div className='text-xs text-gray-500'>HR Manager</div>
                              </div>
                              <Badge variant='secondary' className='bg-blue-100 text-blue-800'>
                                대기중
                              </Badge>
                            </div>

                            <div className='flex items-center gap-2 p-2 rounded-md bg-gray-50'>
                              <Avatar className='w-8 h-8'>
                                <AvatarFallback>김</AvatarFallback>
                              </Avatar>
                              <div className='flex-1'>
                                <div className='text-sm font-medium'>김이준</div>
                                <div className='text-xs text-gray-500'>HR Manager</div>
                              </div>
                              <Badge variant='secondary'>
                                대기중
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* 진행 현황 */}
                  <Card>
                    <CardContent className='p-4'>
                      <div className='space-y-3'>
                        <div className='flex items-center gap-2 text-sm'>
                          <CheckCircle2 className='w-4 h-4 text-green-600' />
                          <div className='flex-1'>
                            <span className='text-gray-600'>작성자가 신청서를 작성중입니다.</span>
                            <div className='text-xs text-gray-400'>방금 전</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* 신청 요약 */}
                  {(form.watch('title') || (isOvertimeType && overtimeHours > 0)) && (
                    <Card>
                      <CardHeader>
                        <CardTitle className='text-lg'>신청 요약</CardTitle>
                      </CardHeader>
                      <CardContent className='space-y-3'>
                        {form.watch('title') && (
                          <div>
                            <p className='text-xs text-gray-500'>제목</p>
                            <p className='text-sm font-medium'>{form.watch('title')}</p>
                          </div>
                        )}
                        {selectedPolicy && (
                          <div>
                            <p className='text-xs text-gray-500'>휴가 정책</p>
                            <p className='text-sm font-medium'>{selectedPolicy.vacation_policy_name}</p>
                          </div>
                        )}
                        {isOvertimeType && overtimeHours > 0 && (
                          <>
                            <div>
                              <p className='text-xs text-gray-500'>초과근무 시간</p>
                              <p className='text-sm font-medium'>{overtimeHours}시간</p>
                            </div>
                            <div>
                              <p className='text-xs text-gray-500'>예상 보상 시간</p>
                              <p className='text-sm font-bold text-blue-600'>
                                {overtimeHours}시간
                              </p>
                            </div>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>

          {/* 하단 버튼 */}
          <DialogFooter className='p-6 pt-4 border-t bg-gray-50'>
            <div className='w-full'>
              <div className='flex items-center gap-2 text-sm text-gray-600 mb-4'>
                <AlertCircle className='w-4 h-4' />
                승인 완료되면 변경 내역이 바로 반영됩니다.
              </div>

              <div className='flex gap-3'>
                <Button type='button' variant='outline' onClick={handleClose} className='flex-1'>
                  취소
                </Button>
                <Button
                  type='submit'
                  className='flex-1'
                  disabled={!form.formState.isValid}
                >
                  결재 요청
                </Button>
              </div>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
