# porest-hr-front

POREST HR 프론트엔드입니다. 근태/휴가/공지/권한/관리자 기능 등 HR 업무 UI를 제공합니다.

## Tech Stack
- React 19
- TypeScript 5.9
- Vite 7
- Tailwind CSS 4 + Radix UI + Ant Design
- TanStack Query, React Router 7, React Hook Form, Zod

## 주요 화면
- 사용자: `dashboard`, `calendar`, `work-schedule`, `work-report`, `vacation-application`, `vacation-history`, `notice`
- 관리자: `admin-users-management`, `admin-users-department`, `admin-company`, `admin-work`, `admin-authority`, `admin-holiday`, `admin-notice`, `admin-vacation-*`
- 인증: `login`, `signup`, `password-change`, `auth-callback`

## 실행

### 요구사항
- Node.js 22+ 권장
- npm

### 설치/실행

```bash
npm install
npm run i18n:generate
npm run dev
```

기본 포트: `3000`

### 빌드

```bash
npm run build
npm run serve
```

## 환경 변수
`.env.local` 예시:

```bash
VITE_APP_TITLE=POREST HR
VITE_BASE_URL=http://localhost:8000
VITE_API_URL=/api/v1
VITE_SSO_URL=http://localhost:3001
```

앱에서는 `VITE_BASE_URL + VITE_API_URL` 조합으로 API 주소를 구성합니다.

## 기타 스크립트

```bash
npm run lint
npm run build:skip-check
```

## Docker

```bash
docker build -t porest-hr-front .
docker run --rm -p 3000:80 porest-hr-front
```
