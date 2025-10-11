// pages/SignUp.tsx
import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useGetValidateInvitationToken, usePostCompleteSignup } from '@/api/auth'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/shadcn/card'
import { Button } from '@/components/shadcn/button'
import { Label } from '@/components/shadcn/label'
import { Checkbox } from '@/components/shadcn/checkbox'
import { Loader2, CheckCircle2, ExternalLink } from 'lucide-react'
import { toast } from '@/components/alert/toast'
import { InputDatePicker } from '@/components/shadcn/inputDatePicker'
import PorestLogo from '@/assets/img/porest.svg'

interface FormData {
  birth: string
  lunarYN: string
}

export default function SignUp() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token') || ''

  const { data: validationData, isLoading, isError } = useGetValidateInvitationToken({ token })
  const { mutate: completeSignup, isPending } = usePostCompleteSignup()

  const [formData, setFormData] = useState<FormData>({
    birth: '',
    lunarYN: 'N'
  })
  const [connectedOAuth, setConnectedOAuth] = useState<string[]>([])

  // ✅ OAuth2 연동 결과 처리
  useEffect(() => {
    const oauth = searchParams.get('oauth')
    const status = searchParams.get('status')
    const error = searchParams.get('error')

    if (oauth && status === 'connected') {
      // OAuth2 연동 성공
      setConnectedOAuth(prev => {
        if (!prev.includes(oauth)) {
          return [...prev, oauth]
        }
        return prev
      })
      toast.success(`${oauth} 계정 연동이 완료되었습니다!`)
      
      // URL 파라미터 정리 (token만 남기고 제거)
      navigate(`/signup?token=${token}`, { replace: true })
    } else if (error) {
      // OAuth2 연동 실패
      toast.error(decodeURIComponent(error))
    }
  }, [searchParams, token, navigate])

  const handleOAuthConnect = (provider: string) => {
    // OAuth2 로그인 시작 (세션에 이미 토큰이 저장되어 있음)
    window.location.href = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/oauth2/authorization/${provider}?token=${token}`
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (connectedOAuth.length === 0) {
      toast.error('최소 하나의 소셜 로그인을 연동해주세요.')
      return
    }

    completeSignup(
      {
        invitation_token: token,
        user_birth: formData.birth,
        lunar_yn: formData.lunarYN
      },
      {
        onSuccess: () => {
          toast.success('회원가입이 완료되었습니다!')
          navigate('/login')
        }
      }
    )
  }

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center">
            <img src={PorestLogo} alt="Porest Logo" className="w-36 h-16" />
          </div>

          <CardTitle className="text-2xl font-semibold tracking-tight">
            회원가입
          </CardTitle>
          <CardContent className="text-sm text-muted-foreground">
            초대받은 정보로 계정을 완성해주세요
          </CardContent>
        </CardHeader>

        <CardContent className="space-y-6">
          {validationData && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <h3 className="font-medium text-sm text-gray-900">초대받은 정보</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p><span className="font-medium">이름:</span> {validationData.user_name}</p>
                <p><span className="font-medium">이메일:</span> {validationData.user_email}</p>
                <p><span className="font-medium">소속:</span> {validationData.user_origin_company_type}</p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                소셜 로그인 연동 <span className="text-red-500">*</span>
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                최소 하나의 소셜 로그인을 연동해야 합니다
              </p>
            </div>

            <div className="space-y-3">
              {/* Google 연동 */}
              <Button
                type="button"
                variant={connectedOAuth.includes('google') ? "default" : "outline"}
                className={`w-full justify-start ${
                  connectedOAuth.includes('google')
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => handleOAuthConnect('google')}
                disabled={connectedOAuth.length > 0}
              >
                <div className="flex items-center w-full">
                  {connectedOAuth.includes('google') ? (
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                  ) : (
                    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  )}
                  <span>
                    {connectedOAuth.includes('google') ? '구글 연동 완료' : 'Google로 연동하기'}
                  </span>
                  {!connectedOAuth.includes('google') && (
                    <ExternalLink className="h-3 w-3 ml-auto" />
                  )}
                </div>
              </Button>

              {/* Naver 연동 */}
              <Button
                type="button"
                variant={connectedOAuth.includes('naver') ? "default" : "outline"}
                className={`w-full justify-start ${
                  connectedOAuth.includes('naver')
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => handleOAuthConnect('naver')}
                disabled={connectedOAuth.length > 0}
              >
                <div className="flex items-center w-full">
                  {connectedOAuth.includes('naver') ? (
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                  ) : (
                    <div className="h-4 w-4 mr-2 bg-green-500 rounded"></div>
                  )}
                  <span>
                    {connectedOAuth.includes('naver') ? '네이버 연동 완료' : '네이버로 연동하기'}
                  </span>
                  {!connectedOAuth.includes('naver') && (
                    <ExternalLink className="h-3 w-3 ml-auto" />
                  )}
                </div>
              </Button>

              {/* Kakao 연동 */}
              <Button
                type="button"
                variant={connectedOAuth.includes('kakao') ? "default" : "outline"}
                className={`w-full justify-start ${
                  connectedOAuth.includes('kakao')
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => handleOAuthConnect('kakao')}
                disabled={connectedOAuth.length > 0}
              >
                <div className="flex items-center w-full">
                  {connectedOAuth.includes('kakao') ? (
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                  ) : (
                    <div className="h-4 w-4 mr-2 bg-yellow-400 rounded"></div>
                  )}
                  <span>
                    {connectedOAuth.includes('kakao') ? '카카오 연동 완료' : '카카오로 연동하기'}
                  </span>
                  {!connectedOAuth.includes('kakao') && (
                    <ExternalLink className="h-3 w-3 ml-auto" />
                  )}
                </div>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">추가 정보</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="birth">생년월일</Label>
              <InputDatePicker
                value={formData.birth}
                onValueChange={(value) => setFormData({...formData, birth: value || ''})}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="lunarYN"
                checked={formData.lunarYN === 'Y'}
                onCheckedChange={(checked) =>
                  setFormData({...formData, lunarYN: checked ? 'Y' : 'N'})
                }
              />
              <Label htmlFor="lunarYN" className="text-sm font-normal cursor-pointer">
                음력 생일 사용
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={connectedOAuth.length === 0 || isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  처리 중...
                </>
              ) : (
                '회원가입 완료'
              )}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              이미 계정이 있으신가요?{' '}
              <Button
                variant="link"
                className="p-0 h-auto font-semibold text-primary"
                onClick={() => navigate('/login')}
              >
                로그인
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
