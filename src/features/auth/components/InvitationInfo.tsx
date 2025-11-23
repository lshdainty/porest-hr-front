import { useSignUpContext } from '../contexts/SignUpContext';

const InvitationInfo = () => {
  const { validationData } = useSignUpContext();

  if (!validationData) return null;

  return (
    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
      <h3 className="font-medium text-sm text-gray-900">초대받은 정보</h3>
      <div className="space-y-1 text-sm text-gray-600">
        <p><span className="font-medium">이름:</span> {validationData.user_name}</p>
        <p><span className="font-medium">이메일:</span> {validationData.user_email}</p>
        <p><span className="font-medium">소속:</span> {validationData.user_origin_company_type}</p>
      </div>
    </div>
  );
};

export default InvitationInfo;
