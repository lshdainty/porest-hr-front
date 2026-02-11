<p align="center">
  <img src="https://img.shields.io/badge/POREST-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="POREST" />
</p>

<h1 align="center">POREST HR Frontend</h1>

<p align="center">
  <strong>사업장 근로자를 위한 일정관리 및 휴가관리 서비스</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
</p>

---

## 소개

**POREST HR Frontend**는 [POREST](https://github.com/lshdainty/POREST) 서비스의 HR(인사관리) 프론트엔드입니다.

React 19와 TypeScript를 기반으로 하며, shadcn/ui 컴포넌트와 Tailwind CSS를 사용하여 모던한 UI를 구현했습니다.

---

## 기술 스택

| Category | Technology |
|----------|------------|
| **Language** | ![TypeScript](https://img.shields.io/badge/TypeScript_5.9-3178C6?style=flat-square&logo=typescript&logoColor=white) |
| **Framework** | ![React](https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black) |
| **Build Tool** | ![Vite](https://img.shields.io/badge/Vite_7-646CFF?style=flat-square&logo=vite&logoColor=white) |
| **Styling** | ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white) ![shadcn/ui](https://img.shields.io/badge/shadcn/ui-000000?style=flat-square&logo=shadcnui&logoColor=white) |
| **State Management** | ![React Query](https://img.shields.io/badge/React_Query-FF4154?style=flat-square&logo=reactquery&logoColor=white) ![Zustand](https://img.shields.io/badge/Zustand-000000?style=flat-square) ![Jotai](https://img.shields.io/badge/Jotai-000000?style=flat-square) |
| **Routing** | ![React Router](https://img.shields.io/badge/React_Router_7-CA4245?style=flat-square&logo=reactrouter&logoColor=white) |
| **Form** | ![React Hook Form](https://img.shields.io/badge/React_Hook_Form-EC5990?style=flat-square&logo=reacthookform&logoColor=white) ![Zod](https://img.shields.io/badge/Zod-3E67B1?style=flat-square&logo=zod&logoColor=white) |
| **Chart** | ![Recharts](https://img.shields.io/badge/Recharts-22B5BF?style=flat-square) |
| **i18n** | ![i18next](https://img.shields.io/badge/i18next-26A69A?style=flat-square&logo=i18next&logoColor=white) |

---

## 프로젝트 구조

```text
src/
├── assets/          # 폰트, 이미지 등 정적 자산
├── components/      # 재사용 가능한 UI 컴포넌트
│   ├── auth/        # 인증 관련 컴포넌트
│   ├── common/      # 공통 컴포넌트
│   ├── layout/      # 레이아웃 컴포넌트
│   ├── shadcn/      # shadcn/ui 컴포넌트
│   ├── sidebar/     # 사이드바 컴포넌트
│   └── ui/          # 기타 UI 컴포넌트
├── config/          # 설정 파일 (라우트 등)
├── constants/       # 상수 정의
├── contexts/        # React Context
├── features/        # 기능별 모듈
│   ├── admin/       # 관리자 기능
│   ├── auth/        # 인증 기능
│   ├── culture/     # 회비/규정 기능
│   ├── home/        # 대시보드/캘린더
│   ├── login/       # 로그인 기능
│   ├── user/        # 사용자 기능
│   ├── vacation/    # 휴가 관리
│   └── work/        # 업무 관리
├── hooks/           # 커스텀 훅
├── lib/             # 유틸리티 라이브러리
├── locales/         # 다국어 리소스 (ko, en)
├── pages/           # 페이지 컴포넌트
├── types/           # TypeScript 타입 정의
└── utils/           # 유틸리티 함수
```

---

## 시작하기

### 요구사항

- **Node.js**: 18+
- **npm**: 9+ (또는 yarn, pnpm)

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드된 앱 프리뷰
npm run serve

# 린트 검사
npm run lint

# 다국어 파일 생성
npm run i18n:generate
```

---

## 국제화 (i18n)

```text
src/locales/
├── en/              # 영어
└── ko/              # 한국어
```

---

## 관련 저장소

| Repository | Description |
|------------|-------------|
| [POREST](https://github.com/lshdainty/POREST) | 통합 레포지토리 (서비스 소개) |
| [porest-hr-back](https://github.com/lshdainty/porest-hr-back) | HR 백엔드 |
| [porest-core](https://github.com/lshdainty/porest-core) | 공통 라이브러리 |
| [porest-sso-back](https://github.com/lshdainty/porest-sso-back) | SSO 백엔드 |
| [porest-sso-front](https://github.com/lshdainty/porest-sso-front) | SSO 프론트엔드 |

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/lshdainty">lshdainty</a>
</p>
