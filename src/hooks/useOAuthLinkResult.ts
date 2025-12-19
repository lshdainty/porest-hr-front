'use client'

import { toast } from '@/components/shadcn/sonner'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams, useNavigate } from 'react-router-dom'

interface UseOAuthLinkResultOptions {
  onSuccess?: () => void
  onError?: (code: string) => void
}

export const useOAuthLinkResult = (options?: UseOAuthLinkResultOptions) => {
  const { t } = useTranslation('user')
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const processedRef = useRef(false)

  useEffect(() => {
    // 이미 처리된 경우 스킵
    if (processedRef.current) return

    const oauthLinkResult = searchParams.get('oauth_link')
    const errorCode = searchParams.get('code')

    if (!oauthLinkResult) return

    processedRef.current = true

    if (oauthLinkResult === 'success') {
      toast.success(t('oauthLink.success'))
      options?.onSuccess?.()
    } else if (oauthLinkResult === 'error') {
      let errorMessage = t('oauthLink.error')

      if (errorCode === 'already_linked_self') {
        errorMessage = t('oauthLink.alreadyLinkedSelf')
      } else if (errorCode === 'already_linked_other') {
        errorMessage = t('oauthLink.alreadyLinkedOther')
      } else if (errorCode === 'user_not_found') {
        errorMessage = t('oauthLink.userNotFound')
      }

      toast.error(errorMessage)
      options?.onError?.(errorCode || 'unknown')
    }

    // URL 파라미터 정리
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.delete('oauth_link')
    newSearchParams.delete('code')

    const newSearch = newSearchParams.toString()
    const newPath = window.location.pathname + (newSearch ? `?${newSearch}` : '')

    navigate(newPath, { replace: true })
  }, [searchParams, navigate, t, options])
}
