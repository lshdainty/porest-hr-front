import { Button } from '@/components/shadcn/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card';
import { usePermission } from '@/contexts/PermissionContext';
import { ApplicationTableContent } from '@/features/vacation/application/components/ApplicationTableContent';
import { VacationApprovalForm } from '@/features/vacation/application/components/VacationApprovalForm';
import { VacationGrantDialog } from '@/features/vacation/application/components/VacationGrantDialog';
import { usePostCancelVacationRequestMutation } from '@/hooks/queries/useVacations';
import { TypeResp } from '@/lib/api/type';
import { GetUserRequestedVacationsResp } from '@/lib/api/vacation';
import { Activity, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface ApplicationTableProps {
  vacationRequests: GetUserRequestedVacationsResp[]
  grantStatusTypes: TypeResp[]
  userId?: string
  showGrantButton?: boolean
  showCancelButton?: boolean
}

const ApplicationTable = ({
  vacationRequests,
  grantStatusTypes,
  userId,
  showGrantButton = false,
  showCancelButton = true
}: ApplicationTableProps) => {
  const { t } = useTranslation('vacation');
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<GetUserRequestedVacationsResp | null>(null);
  const [grantDialogOpen, setGrantDialogOpen] = useState(false);
  const { hasAnyPermission } = usePermission();

  const { mutate: cancelVacationRequest } = usePostCancelVacationRequestMutation();

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
      <Card className='flex-1'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle>{t('application.requestHistory')}</CardTitle>
            <Activity mode={showGrantButton && hasAnyPermission(['VACATION:GRANT', 'VACATION:MANAGE']) ? 'visible' : 'hidden'}>
              <Button
                onClick={() => setGrantDialogOpen(true)}
                className='bg-blue-600 hover:bg-blue-700 text-white'
              >
                {t('application.grantVacation')}
              </Button>
            </Activity>
          </div>
        </CardHeader>
        <CardContent>
          <ApplicationTableContent
            vacationRequests={vacationRequests}
            grantStatusTypes={grantStatusTypes}
            onDetailView={handleDetailView}
            onCancelRequest={showCancelButton ? handleCancelRequest : undefined}
          />
        </CardContent>
      </Card>

      {/* 상세보기 다이얼로그 */}
      <VacationApprovalForm
        open={detailOpen}
        onClose={handleDetailClose}
        requestData={selectedRequest || undefined}
      />

      {/* 휴가 부여 다이얼로그 */}
      <VacationGrantDialog
        open={grantDialogOpen}
        onClose={() => setGrantDialogOpen(false)}
      />
    </>
  );
}

export { ApplicationTable }
