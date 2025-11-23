import { GetValidateInvitationTokenResp } from '@/lib/api/auth';
import { createContext, ReactNode, useContext } from 'react';

interface FormData {
  birth: string;
  lunarYN: string;
}

interface SignUpContextType {
  token: string;
  validationData: GetValidateInvitationTokenResp | undefined;
  isLoading: boolean;
  isError: boolean;
  isPending: boolean;
  formData: FormData;
  setFormData: (data: FormData) => void;
  connectedOAuth: string[];
  setConnectedOAuth: React.Dispatch<React.SetStateAction<string[]>>;
  handleOAuthConnect: (provider: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const SignUpContext = createContext<SignUpContextType | null>(null);

export const useSignUpContext = () => {
  const context = useContext(SignUpContext);
  if (!context) throw new Error('Cannot find SignUpProvider');
  return context;
};

export const SignUpProvider = ({
  children,
  value
}: {
  children: ReactNode;
  value: SignUpContextType;
}) => {
  return (
    <SignUpContext.Provider value={value}>
      {children}
    </SignUpContext.Provider>
  );
};
