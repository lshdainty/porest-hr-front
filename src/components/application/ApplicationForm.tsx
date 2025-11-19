import type { GetUserApproversResp } from '@/lib/api/user'
import type { GetUserVacationPoliciesResp } from '@/lib/api/vacation'
import { usePostRequestVacationMutation } from '@/hooks/queries/useVacations'
import { Avatar, AvatarFallback } from '@/components/shadcn/avatar'
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
import { useUser } from '@/contexts/UserContext'
import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'
import { AlertCircle, Calendar, Clock, Users } from 'lucide-react'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
  vacationPolicyId: z.number().min(1, '휴가 정책을 선택해주세요.'),
  title: z.string().min(1, '제목을 입력해주세요.'),
  overtimeDate: z.string().min(1, '날짜를 선택해주세요.'),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  grantTime: z.number().optional(),
  reason: z.string().min(1, '사유를 입력해주세요.'),
  approvers: z.array(z.string()),
})

type OvertimeFormValues = z.infer<typeof formSchema>

interface ApplicationFormDialogProps {
  open: boolean
  onClose: () => void
  onSubmitSuccess: () => void
  vacationPolicies: GetUserVacationPoliciesResp[]
  approvers: GetUserApproversResp[]
}

export default function ApplicationFormDialog({ open, onClose, onSubmitSuccess, vacationPolicies, approvers }: ApplicationFormDialogProps) {
  const { loginUser } = useUser()
  const { mutate: requestVacation } = usePostRequestVacationMutation()

  const form = useForm<OvertimeFormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      vacationPolicyId: 0,
      title: '',
      overtimeDate: '',
      startTime: '',
      endTime: '',
      grantTime: undefined,
      reason: '',
      approvers: []
    }
  })

  const vacationPolicyId = form.watch('vacationPolicyId')
  const startTime = form.watch('startTime')
  const endTime = form.watch('endTime')
  const selectedApprovers = form.watch('approvers')

  console.log(vacationPolicies)

  // 선택된 정책 찾기
  const selectedPolicy = vacationPolicies.find(
    policy => policy.vacation_policy_id === vacationPolicyId
  )

  // overtime 타입인지 확인 (대소문자 무관하게 체크)
  const isOvertimeType = selectedPolicy?.vacation_type?.toLowerCase() === 'overtime'

  // 승인자 선택 완료 여부 확인
  const approvalRequiredCount = selectedPolicy?.approval_required_count || 0
  const isApproversValid = approvalRequiredCount === 0 ||
    (selectedApprovers && selectedApprovers.filter(a => a).length === approvalRequiredCount)

  // 정책 변경 시 날짜와 시간 필드 초기화
  useEffect(() => {
    if (vacationPolicyId) {
      form.setValue('overtimeDate', '')
      form.setValue('startTime', '')
      form.setValue('endTime', '')
      form.setValue('grantTime', undefined)
      form.setValue('approvers', [])
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
        grantTime: undefined,
        reason: '',
        approvers: []
      })
    }
  }, [open, form])

  const onSubmit = (values: OvertimeFormValues) => {
    if (!loginUser?.user_id) {
      console.error('User not logged in')
      return
    }

    // 날짜와 시간을 LocalDateTime 형식으로 변환
    // overtime 타입인 경우: 시작시간과 종료시간 포함
    // 일반 휴가인 경우: 해당 날짜의 00:00:00, 종료시간은 null
    const requestStartTime = isOvertimeType && values.startTime
      ? `${values.overtimeDate}T${values.startTime}:00`
      : `${values.overtimeDate}T00:00:00`
    const requestEndTime = isOvertimeType && values.endTime
      ? `${values.overtimeDate}T${values.endTime}:00`
      : null

    // API 요청 데이터 생성
    const baseRequestData = {
      user_id: loginUser.user_id,
      policy_id: values.vacationPolicyId,
      desc: values.title,
      approver_ids: values.approvers.filter(a => a),
      request_start_time: requestStartTime,
      request_end_time: requestEndTime,
      request_desc: values.reason
    }

    // is_flexible_grant가 Y이면 grant_time 추가
    const requestData = selectedPolicy?.is_flexible_grant === 'Y' && values.grantTime
      ? { ...baseRequestData, grant_time: values.grantTime }
      : baseRequestData

    requestVacation(requestData, {
      onSuccess: () => {
        onSubmitSuccess()
        onClose()
      }
    })
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

                          {/* is_flexible_grant가 Y이면 부여 시간 입력 */}
                          {selectedPolicy?.is_flexible_grant === 'Y' && (
                            <Controller
                              control={form.control}
                              name='grantTime'
                              render={({ field, fieldState }) => {
                                const totalValue = field.value || 0
                                const days = Math.floor(totalValue)
                                const remainder = totalValue - days
                                const hours = Math.floor(remainder / 0.125)
                                const minutes = (remainder - hours * 0.125) >= 0.0625 ? 30 : 0

                                const handleTimeChange = (newDays: number, newHours: number, newMinutes: number) => {
                                  const total = newDays + (newHours * 0.125) + (newMinutes === 30 ? 0.0625 : 0)
                                  field.onChange(total > 0 ? total : undefined)
                                }

                                return (
                                  <Field data-invalid={!!fieldState.error}>
                                    <FieldLabel>
                                      부여 시간
                                      <span className='text-destructive ml-0.5'>*</span>
                                    </FieldLabel>
                                    <div className={`grid ${selectedPolicy?.minute_grant_yn === 'Y' ? 'grid-cols-3' : 'grid-cols-2'} gap-4`}>
                                      <div className='flex flex-col'>
                                        <Input
                                          type='number'
                                          min='0'
                                          max='365'
                                          placeholder='일'
                                          className='w-full'
                                          value={days || ''}
                                          onChange={(e) => {
                                            const newDays = e.target.value ? parseInt(e.target.value) : 0
                                            handleTimeChange(newDays, hours, minutes)
                                          }}
                                        />
                                        <p className='text-xs text-muted-foreground mt-1'>일</p>
                                      </div>
                                      <div className='flex flex-col'>
                                        <Select
                                          value={hours.toString()}
                                          onValueChange={(value) => {
                                            handleTimeChange(days, parseInt(value), minutes)
                                          }}
                                        >
                                          <SelectTrigger className='w-full'>
                                            <SelectValue placeholder='시간' />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {[0, 1, 2, 3, 4, 5, 6, 7].map((h) => (
                                              <SelectItem key={h} value={h.toString()}>
                                                {h}시간
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                        <p className='text-xs text-muted-foreground mt-1'>시간</p>
                                      </div>
                                      {selectedPolicy?.minute_grant_yn === 'Y' && (
                                        <div className='flex flex-col'>
                                          <Select
                                            value={minutes.toString()}
                                            onValueChange={(value) => {
                                              handleTimeChange(days, hours, parseInt(value))
                                            }}
                                          >
                                            <SelectTrigger className='w-full'>
                                              <SelectValue placeholder='분' />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value='0'>0분</SelectItem>
                                              <SelectItem value='30'>30분</SelectItem>
                                            </SelectContent>
                                          </Select>
                                          <p className='text-xs text-muted-foreground mt-1'>분</p>
                                        </div>
                                      )}
                                    </div>
                                    <p className='text-sm text-muted-foreground mt-2'>
                                      부여할 휴가를 일/시간{selectedPolicy?.minute_grant_yn === 'Y' ? '/분' : ''} 단위로 선택해주세요.
                                      {field.value && field.value > 0 && (
                                        <span className='block mt-1 font-medium text-primary'>
                                          총 {[
                                            days > 0 ? `${days}일` : '',
                                            hours > 0 ? `${hours}시간` : '',
                                            minutes > 0 && selectedPolicy?.minute_grant_yn === 'Y' ? `${minutes}분` : ''
                                          ].filter(Boolean).join(' ')}
                                        </span>
                                      )}
                                    </p>
                                    <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                                  </Field>
                                )
                              }}
                            />
                          )}

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
                                  {selectedPolicy?.is_flexible_grant === 'Y' && form.watch('grantTime')
                                    ? (() => {
                                        const grantTime = form.watch('grantTime') || 0
                                        const days = Math.floor(grantTime)
                                        const remainder = grantTime - days
                                        const hours = Math.floor(remainder / 0.125)
                                        const minutes = (remainder - hours * 0.125) >= 0.0625 ? 30 : 0
                                        return [
                                          days > 0 ? `${days}일` : '',
                                          hours > 0 ? `${hours}시간` : '',
                                          minutes > 0 && selectedPolicy?.minute_grant_yn === 'Y' ? `${minutes}분` : ''
                                        ].filter(Boolean).join(' ') || '-'
                                      })()
                                    : overtimeHours > 0 ? `${overtimeHours}시간` : '-'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
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

                          {/* is_flexible_grant가 Y이면 부여 시간 입력 */}
                          {selectedPolicy?.is_flexible_grant === 'Y' && (
                            <Controller
                              control={form.control}
                              name='grantTime'
                              render={({ field, fieldState }) => {
                                const totalValue = field.value || 0
                                const days = Math.floor(totalValue)
                                const remainder = totalValue - days
                                const hours = Math.floor(remainder / 0.125)
                                const minutes = (remainder - hours * 0.125) >= 0.0625 ? 30 : 0

                                const handleTimeChange = (newDays: number, newHours: number, newMinutes: number) => {
                                  const total = newDays + (newHours * 0.125) + (newMinutes === 30 ? 0.0625 : 0)
                                  field.onChange(total > 0 ? total : undefined)
                                }

                                return (
                                  <Field data-invalid={!!fieldState.error}>
                                    <FieldLabel>
                                      부여 시간
                                      <span className='text-destructive ml-0.5'>*</span>
                                    </FieldLabel>
                                    <div className={`grid ${selectedPolicy?.minute_grant_yn === 'Y' ? 'grid-cols-3' : 'grid-cols-2'} gap-4`}>
                                      <div className='flex flex-col'>
                                        <Input
                                          type='number'
                                          min='0'
                                          max='365'
                                          placeholder='일'
                                          className='w-full'
                                          value={days || ''}
                                          onChange={(e) => {
                                            const newDays = e.target.value ? parseInt(e.target.value) : 0
                                            handleTimeChange(newDays, hours, minutes)
                                          }}
                                        />
                                        <p className='text-xs text-muted-foreground mt-1'>일</p>
                                      </div>
                                      <div className='flex flex-col'>
                                        <Select
                                          value={hours.toString()}
                                          onValueChange={(value) => {
                                            handleTimeChange(days, parseInt(value), minutes)
                                          }}
                                        >
                                          <SelectTrigger className='w-full'>
                                            <SelectValue placeholder='시간' />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {[0, 1, 2, 3, 4, 5, 6, 7].map((h) => (
                                              <SelectItem key={h} value={h.toString()}>
                                                {h}시간
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                        <p className='text-xs text-muted-foreground mt-1'>시간</p>
                                      </div>
                                      {selectedPolicy?.minute_grant_yn === 'Y' && (
                                        <div className='flex flex-col'>
                                          <Select
                                            value={minutes.toString()}
                                            onValueChange={(value) => {
                                              handleTimeChange(days, hours, parseInt(value))
                                            }}
                                          >
                                            <SelectTrigger className='w-full'>
                                              <SelectValue placeholder='분' />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value='0'>0분</SelectItem>
                                              <SelectItem value='30'>30분</SelectItem>
                                            </SelectContent>
                                          </Select>
                                          <p className='text-xs text-muted-foreground mt-1'>분</p>
                                        </div>
                                      )}
                                    </div>
                                    <p className='text-sm text-muted-foreground mt-2'>
                                      부여할 휴가를 일/시간{selectedPolicy?.minute_grant_yn === 'Y' ? '/분' : ''} 단위로 선택해주세요.
                                      {field.value && field.value > 0 && (
                                        <span className='block mt-1 font-medium text-primary'>
                                          총 {[
                                            days > 0 ? `${days}일` : '',
                                            hours > 0 ? `${hours}시간` : '',
                                            minutes > 0 && selectedPolicy?.minute_grant_yn === 'Y' ? `${minutes}분` : ''
                                          ].filter(Boolean).join(' ')}
                                        </span>
                                      )}
                                    </p>
                                    <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                                  </Field>
                                )
                              }}
                            />
                          )}
                        </>
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
                    </CardContent>
                  </Card>
                </div>

                {/* 사이드바 */}
                <div className='lg:col-span-1 space-y-4'>
                  {/* 승인자 지정 */}
                  <Card>
                    <CardHeader>
                      <CardTitle className='text-lg flex items-center gap-2'>
                        <Users className='w-5 h-5' />
                        승인자 지정
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className='space-y-4'>
                        {selectedPolicy?.approval_required_count ? (
                          Array.from({ length: selectedPolicy.approval_required_count }).map((_, index) => (
                            <div key={index}>
                              {index > 0 && <Separator className='my-4' />}
                              <div className={index > 0 ? 'mt-4' : ''}>
                                <h4 className='text-sm font-medium text-gray-700 mb-2'>
                                  {index + 1}단계 인원 지정
                                </h4>
                                <Controller
                                  control={form.control}
                                  name={`approvers.${index}` as const}
                                  rules={{ required: '승인자를 선택해주세요' }}
                                  render={({ field }) => (
                                    <Select value={field.value || ''} onValueChange={field.onChange}>
                                      <SelectTrigger>
                                        <SelectValue placeholder='결재자를 선택해주세요' />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {approvers.map((approver) => (
                                          <SelectItem key={approver.user_id} value={approver.user_id}>
                                            <div className='flex items-center gap-2'>
                                              <Avatar className='w-6 h-6'>
                                                <AvatarFallback>{approver.user_name.charAt(0)}</AvatarFallback>
                                              </Avatar>
                                              <div className='text-left'>
                                                <div className='font-medium'>{approver.user_name}</div>
                                                <div className='text-xs text-gray-500'>{approver.department_name_kr}</div>
                                              </div>
                                            </div>
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  )}
                                />
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className='p-3 rounded-md border border-dashed border-gray-300 bg-gray-50'>
                            <p className='text-sm text-gray-500 text-center'>휴가 정책을 먼저 선택해주세요</p>
                          </div>
                        )}
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
                  disabled={!form.formState.isValid || !isApproversValid}
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
