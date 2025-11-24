import ApplicationTableContent from '@/features/vacation/application/components/ApplicationTableContent';
import ApplicationTableSkeleton from '@/features/vacation/application/components/ApplicationTableSkeleton';
import VacationApprovalForm from '@/features/vacation/application/components/VacationApprovalForm';
import { usePostCancelVacationRequestMutation } from '@/hooks/queries/useVacations';
import { TypeResp } from '@/lib/api/type';
import { GetUserRequestedVacationsResp } from '@/lib/api/vacation';
import { useState } from 'react';

interface ApplicationTableWidgetProps {
  vacationRequests?: GetUserRequestedVacationsResp[];
  grantStatusTypes: TypeResp[];
  userId: string;
  userName?: string;
}

const ApplicationTableWidget = ({
  vacationRequests,
  grantStatusTypes,
  userId,
  userName,
}: ApplicationTableWidgetProps) => {
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<GetUserRequestedVacationsResp | null>(null);

  const { mutate: cancelVacationRequest } = usePostCancelVacationRequestMutation();

  if (!vacationRequests) {
    return <ApplicationTableSkeleton />;
  }

  const handleDetailView = (request: GetUserRequestedVacationsResp) => {
    setSelectedRequest(request);
    setDetailOpen(true);
  };

  const handleDetailClose = () => {
    setDetailOpen(false);
    setSelectedRequest(null);
  };

  const handleCancelRequest = (requestId: number) => {
    if (!userId) return;

    cancelVacationRequest({
      vacationGrantId: requestId,
      userId: userId
    });
  };

  return (
    <>
      <ApplicationTableContent
        vacationRequests={vacationRequests}
        grantStatusTypes={grantStatusTypes}
        onDetailView={handleDetailView}
        onCancelRequest={handleCancelRequest}
      />

      {/* 상세보기 다이얼로그 */}
      <VacationApprovalForm
        open={detailOpen}
        onClose={handleDetailClose}
        requestData={selectedRequest || undefined}
        applicantName={userName}
      />
    </>
  );
};

export default ApplicationTableWidget;
