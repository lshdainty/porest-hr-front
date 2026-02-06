import { Button } from '@/components/shadcn/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card'
import { Empty, EmptyDescription, EmptyIcon, EmptyTitle } from '@/components/shadcn/empty'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shadcn/tabs'
import { usePermission } from '@/contexts/PermissionContext'
import { ApplicationTableContent } from '@/features/vacation/application/components/ApplicationTableContent'
import { VacationApprovalForm } from '@/features/vacation/application/components/VacationApprovalForm'
import { VacationGrantDialog } from '@/features/vacation/application/components/VacationGrantDialog'
import { usePostCancelVacationRequestMutation } from '@/hooks/queries/useVacations'
import { TypeResp } from '@/lib/api/type'
import { GetUserRequestedVacationsResp } from '@/lib/api/vacation'
import { CalendarX2 } from 'lucide-react'
import { Activity, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface ApplicationTableProps {
  vacationRequests: GetUserRequestedVacationsResp[]
  grantStatusTypes: TypeResp[]
  userId?: string
  showGrantButton?: boolean
  showCancelButton?: boolean
  approvalRequests?: GetUserRequestedVacationsResp[]
  showApprovalTab?: boolean
}

const ApplicationTable = ({
  vacationRequests,
  grantStatusTypes,
  userId,
  showGrantButton = false,
  showCancelButton = true,
  approvalRequests = [],
  showApprovalTab = false
}: ApplicationTableProps) => {
  const { t } = useTranslation('vacation')
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<GetUserRequestedVacationsResp | null>(null)
  const [grantDialogOpen, setGrantDialogOpen] = useState(false)
  const { hasAnyPermission } = usePermission()

  const { mutate: cancelVacationRequest } = usePostCancelVacationRequestMutation()

  const handleDetailView = (request: GetUserRequestedVacationsResp) => {
    setSelectedRequest(request)
    setDetailOpen(true)
  }

  const handleDetailClose = () => {
    setDetailOpen(false)
    setSelectedRequest(null)
  }

  const handleCancelRequest = (requestId: number) => {
    if (!userId) return

    cancelVacationRequest({
      vacationGrantId: requestId,
      userId: userId
    })
  }

  return (
    <>
      <Card className='flex-1'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle>{t('application.applicationHistory')}</CardTitle>
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
          <Tabs defaultValue="requests">
            <TabsList>
              <TabsTrigger value="requests">{t('application.requestTab')}</TabsTrigger>
              <Activity mode={showApprovalTab ? 'visible' : 'hidden'}>
                <TabsTrigger value="approvals">{t('application.approvalTab')}</TabsTrigger>
              </Activity>
            </TabsList>

            <TabsContent value="requests" className="mt-4">
              {vacationRequests.length === 0 ? (
                <div className="min-h-[300px] flex items-center justify-center">
                  <Empty>
                    <EmptyIcon>
                      <CalendarX2 />
                    </EmptyIcon>
                    <EmptyTitle>{t('application.noRequestsTitle')}</EmptyTitle>
                    <EmptyDescription>
                      {t('application.noRequestsDescription')}
                    </EmptyDescription>
                  </Empty>
                </div>
              ) : (
                <ApplicationTableContent
                  vacationRequests={vacationRequests}
                  grantStatusTypes={grantStatusTypes}
                  onDetailView={handleDetailView}
                  onCancelRequest={showCancelButton ? handleCancelRequest : undefined}
                />
              )}
            </TabsContent>

            <Activity mode={showApprovalTab ? 'visible' : 'hidden'}>
              <TabsContent value="approvals" className="mt-4">
                {approvalRequests.length === 0 ? (
                  <div className="min-h-[300px] flex items-center justify-center">
                    <Empty>
                      <EmptyIcon>
                        <CalendarX2 />
                      </EmptyIcon>
                      <EmptyTitle>{t('application.noApprovalsTitle')}</EmptyTitle>
                      <EmptyDescription>
                        {t('application.noApprovalsDesc')}
                      </EmptyDescription>
                    </Empty>
                  </div>
                ) : (
                  <ApplicationTableContent
                    vacationRequests={approvalRequests}
                    grantStatusTypes={grantStatusTypes}
                    onDetailView={handleDetailView}
                  />
                )}
              </TabsContent>
            </Activity>
          </Tabs>
        </CardContent>
      </Card>

      <VacationApprovalForm
        open={detailOpen}
        onClose={handleDetailClose}
        requestData={selectedRequest || undefined}
      />

      <VacationGrantDialog
        open={grantDialogOpen}
        onClose={() => setGrantDialogOpen(false)}
      />
    </>
  )
}

export { ApplicationTable }
