import { useTranslation } from 'react-i18next'
import { useCallback } from 'react'
import { SUPPORTED_LANGUAGES, LANGUAGE_LABELS, type SupportedLanguage } from '@/app/config/i18n'

/**
 * 언어 관련 유틸리티 훅
 *
 * 사용 예시:
 * const { currentLanguage, changeLanguage, languages } = useLanguage()
 */
export function useLanguage() {
  const { i18n } = useTranslation()

  const currentLanguage = i18n.language as SupportedLanguage

  const changeLanguage = useCallback((lang: SupportedLanguage) => {
    i18n.changeLanguage(lang)
  }, [i18n])

  const languages = SUPPORTED_LANGUAGES.map(lang => ({
    code: lang,
    label: LANGUAGE_LABELS[lang]
  }))

  return {
    currentLanguage,
    changeLanguage,
    languages,
    isKorean: currentLanguage === 'ko',
    isEnglish: currentLanguage === 'en'
  }
}
