import { LoginContent } from '@/features/login/components/LoginContent';
import { LoginProvider } from '@/features/login/contexts/LoginContext';

const LoginPage = () => {
  return (
    <LoginProvider>
      <LoginContent />
    </LoginProvider>
  );
};

export { LoginPage };
