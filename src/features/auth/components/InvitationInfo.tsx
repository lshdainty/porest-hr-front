import { useSignUpContext } from '@/features/auth/contexts/SignUpContext';
import { useTranslation } from 'react-i18next';

const InvitationInfo = () => {
  const { t } = useTranslation('auth');
  const { validationData } = useSignUpContext();

  if (!validationData) return null;

  return (
    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
      <h3 className="font-medium text-sm text-gray-900">{t('signup.invitationInfo')}</h3>
      <div className="space-y-1 text-sm text-gray-600">
        <p><span className="font-medium">{t('signup.invitationName')}:</span> {validationData.user_name}</p>
        <p><span className="font-medium">{t('signup.invitationEmail')}:</span> {validationData.user_email}</p>
        <p><span className="font-medium">{t('signup.invitationCompany')}:</span> {validationData.user_company_type}</p>
      </div>
    </div>
  );
};

export { InvitationInfo };
