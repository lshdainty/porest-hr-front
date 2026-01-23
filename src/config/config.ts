interface Config {
  appTitle: string;
  baseUrl: string;
  apiBaseUrl: string;
  ssoUrl: string;
}

const config: Config = {
  appTitle: import.meta.env.VITE_APP_TITLE,
  baseUrl: import.meta.env.VITE_BASE_URL,
  apiBaseUrl: `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_API_URL}`,
  ssoUrl: import.meta.env.VITE_SSO_URL || ''
};

// 개발 모드에서 환경 변수 확인
if (import.meta.env.DEV) {
  console.log('현재 환경 설정:', config);
}

export default config;