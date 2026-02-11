import { LoginContent } from '@/features/auth/ui/LoginContent';
import { LoginProvider } from '@/features/auth/model/LoginContext';

const LoginPage = () => {
  return (
    <LoginProvider>
      <LoginContent />
    </LoginProvider>
  );
};

export { LoginPage };
