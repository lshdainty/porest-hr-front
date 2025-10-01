import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { api } from '@/api/index'
import { useGetValidateInvitationToken } from '@/api/user'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/shadcn/card'
import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'
import { Label } from '@/components/shadcn/label'
import { Checkbox } from '@/components/shadcn/checkbox'
import { Loader2, UserCircle, Mail, Building2, Calendar, Clock } from 'lucide-react'
import { toast } from '@/components/alert/toast'
import { cn } from '@/lib/utils'

interface FormData {
  birth: string
  workTime: string
  lunarYN: string
}

export default function SignUp() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token') || ''

  const { data: validationData, isLoading, isError } = useGetValidateInvitationToken({ token })

  const [formData, setFormData] = useState<FormData>({
    birth: '',
    workTime: '9 ~ 6',
    lunarYN: 'N'
  })
  const [connectedOAuth] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)

  const handleOAuthConnect = (provider: string) => {
    sessionStorage.setItem('signupToken', token || '')
    sessionStorage.setItem('signupStep', 'oauth-connect')

    window.location.href = `/oauth2/authorization/${provider}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (connectedOAuth.length === 0) {
      toast.error('최소 하나의 소셜 로그인을 연동해주세요.')
      return
    }

    try {
      setSubmitting(true)

      await api.request({
        method: 'post',
        url: '/auth/api/signup/complete',
        data: {
          token,
          ...formData
        }
      })

      toast.success('회원가입이 완료되었습니다!')
      navigate('/login')
    } catch (error: any) {
      toast.error('회원가입에 실패했습니다: ' + (error.response?.data?.message || ''))
    } finally {
      setSubmitting(false)
    }
  }

  const workTimeOptions = [
    { value: '8 ~ 5', label: '8시 ~ 5시', className: 'text-rose-500' },
    { value: '9 ~ 6', label: '9시 ~ 6시', className: 'text-sky-500' },
    { value: '10 ~ 7', label: '10시 ~ 7시', className: 'text-emerald-500' }
  ]

  const selectedWorkTime = workTimeOptions.find(option => option.value === formData.workTime)

  if (isLoading || !token) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (isError || !validationData || validationData.invitation_status !== 'PENDING') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center text-destructive">
              <p className="text-lg font-semibold">
                {isError ? '초대 링크 확인에 실패했습니다.' :
                 !validationData ? '유효하지 않은 초대 링크입니다.' :
                 validationData.invitation_status === 'ACTIVE' ? '이미 가입이 완료된 링크입니다.' :
                 validationData.invitation_status === 'EXPIRED' ? '만료된 초대 링크입니다.' :
                 validationData.invitation_status === 'INACTIVE' ? '비활성화된 초대 링크입니다.' :
                 '유효하지 않은 초대 링크입니다.'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">회원가입</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-lg">초대받은 사용자 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <UserCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">이름:</span>
                <span className="text-sm">{validationData.user_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">이메일:</span>
                <span className="text-sm">{validationData.user_email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">소속 회사:</span>
                <span className="text-sm">{validationData.user_origin_company_type}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">근무 시간:</span>
                <span className="text-sm">{validationData.user_work_time}</span>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">소셜 로그인 연동 (필수)</h3>
              <p className="text-sm text-muted-foreground mb-4">최소 하나의 소셜 로그인을 연동해야 합니다.</p>

              <div className="grid gap-3">
                <Button
                  type="button"
                  variant={connectedOAuth.includes('google') ? 'default' : 'outline'}
                  className={cn(
                    'w-full justify-start',
                    connectedOAuth.includes('google') && 'bg-red-500 hover:bg-red-600'
                  )}
                  onClick={() => handleOAuthConnect('google')}
                  disabled={connectedOAuth.includes('google')}
                >
                  {connectedOAuth.includes('google') ? '✓ 구글 연동 완료' : '구글로 연동하기'}
                </Button>

                <Button
                  type="button"
                  variant={connectedOAuth.includes('naver') ? 'default' : 'outline'}
                  className={cn(
                    'w-full justify-start',
                    connectedOAuth.includes('naver') && 'bg-green-500 hover:bg-green-600'
                  )}
                  onClick={() => handleOAuthConnect('naver')}
                  disabled={connectedOAuth.includes('naver')}
                >
                  {connectedOAuth.includes('naver') ? '✓ 네이버 연동 완료' : '네이버로 연동하기'}
                </Button>

                <Button
                  type="button"
                  variant={connectedOAuth.includes('kakao') ? 'default' : 'outline'}
                  className={cn(
                    'w-full justify-start',
                    connectedOAuth.includes('kakao') && 'bg-yellow-500 hover:bg-yellow-600'
                  )}
                  onClick={() => handleOAuthConnect('kakao')}
                  disabled={connectedOAuth.includes('kakao')}
                >
                  {connectedOAuth.includes('kakao') ? '✓ 카카오 연동 완료' : '카카오로 연동하기'}
                </Button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-lg font-semibold">추가 정보 입력</h3>

              <div className="space-y-2">
                <Label htmlFor="birth">
                  <Calendar className="h-4 w-4 inline-block mr-1" />
                  생년월일
                </Label>
                <Input
                  id="birth"
                  type="date"
                  value={formData.birth}
                  onChange={(e) => setFormData({...formData, birth: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="workTime">
                  <Clock className="h-4 w-4 inline-block mr-1" />
                  근무시간
                </Label>
                <Select
                  value={formData.workTime}
                  onValueChange={(value) => setFormData({...formData, workTime: value})}
                >
                  <SelectTrigger id="workTime" className={cn('w-full', selectedWorkTime?.className)}>
                    <SelectValue placeholder="근무 시간 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {workTimeOptions.map(option => (
                      <SelectItem key={option.value} value={option.value} className={option.className}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="lunarYN"
                  checked={formData.lunarYN === 'Y'}
                  onCheckedChange={(checked) =>
                    setFormData({...formData, lunarYN: checked ? 'Y' : 'N'})
                  }
                />
                <Label htmlFor="lunarYN" className="cursor-pointer">
                  음력 생일 사용
                </Label>
              </div>

              <Button
                type="submit"
                disabled={connectedOAuth.length === 0 || submitting}
                className="w-full"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    처리 중...
                  </>
                ) : (
                  '회원가입 완료'
                )}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
