import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// 각 언어별 네임스페이스 import
import koCommon from '@/locales/ko/common.json'
import koLogin from '@/locales/ko/login.json'
import koSidebar from '@/locales/ko/sidebar.json'

import enCommon from '@/locales/en/common.json'
import enLogin from '@/locales/en/login.json'
import enSidebar from '@/locales/en/sidebar.json'

// 지원하는 언어 목록
export const SUPPORTED_LANGUAGES = ['ko', 'en'] as const
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number]

// 언어 표시 이름
export const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  ko: '한국어',
  en: 'English'
}

// 네임스페이스 목록
export const NAMESPACES = ['common', 'login', 'sidebar'] as const
export type Namespace = typeof NAMESPACES[number]

// 리소스 번들
const resources = {
  ko: {
    common: koCommon,
    login: koLogin,
    sidebar: koSidebar
  },
  en: {
    common: enCommon,
    login: enLogin,
    sidebar: enSidebar
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ko',
    defaultNS: 'common',
    ns: NAMESPACES,

    interpolation: {
      escapeValue: false // React가 XSS 방지를 처리함
    },

    detection: {
      // 언어 감지 순서
      order: ['localStorage', 'navigator'],
      // localStorage에 저장할 키
      lookupLocalStorage: 'i18nextLng',
      // 캐시 저장소
      caches: ['localStorage']
    }
  })

export default i18n
