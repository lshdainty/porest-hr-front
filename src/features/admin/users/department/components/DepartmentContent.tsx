import { Button } from '@/components/shadcn/button';
import { Dialog, DialogContent } from '@/components/shadcn/dialog';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/shadcn/resizable';
import { Skeleton } from '@/components/shadcn/skeleton';
import { DepartmentTreePanel } from '@/features/admin/company/components/DepartmentTreePanel';
import { DepartmentTreePanelSkeleton } from '@/features/admin/company/components/DepartmentTreePanelSkeleton';
import { UserDepartmentTransfer } from '@/features/admin/users/department/components/UserDepartmentTransfer';
import { useDepartmentContext } from '@/features/admin/users/department/contexts/DepartmentContext';
import { useCompanyQuery, useCompanyWithDepartmentsQuery } from '@/hooks/queries/useCompanies';
import { useDeleteDepartmentUsersMutation, useDepartmentUsersQuery, usePostDepartmentUsersMutation } from '@/hooks/queries/useDepartments';
import { useIsMobile } from '@/hooks/useMobile';
import { type UserInfo } from '@/lib/api/department';
import { ArrowLeft, Building2 } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const DepartmentContent = () => {
  const { t } = useTranslation('admin');
  const { selectedDept, setSelectedDept } = useDepartmentContext();

  const { data: company, isLoading } = useCompanyQuery();
  const { data: companyWithDepartments } = useCompanyWithDepartmentsQuery(company?.company_id ?? '');

  const { data: departmentUsers, isLoading: isDepartmentUsersLoading } = useDepartmentUsersQuery(
    selectedDept?.department_id
  );

  const postDepartmentUsers = usePostDepartmentUsersMutation();
  const deleteDepartmentUsers = useDeleteDepartmentUsersMutation();

  const departments = useMemo(() => {
    return companyWithDepartments?.departments || [];
  }, [companyWithDepartments]);

  const handleTransfer = async (addedUsers: UserInfo[], removedUsers: UserInfo[]) => {
    if (!selectedDept?.department_id) return;

    const departmentId = selectedDept.department_id;

    try {
      // 추가할 사용자가 있는 경우
      if (addedUsers.length > 0) {
        await postDepartmentUsers.mutateAsync({
          departmentId,
          data: {
            users: addedUsers.map(user => ({
              user_id: user.user_id,
              main_yn: user.main_yn
            }))
          }
        });
      }

      // 삭제할 사용자가 있는 경우
      if (removedUsers.length > 0) {
        await deleteDepartmentUsers.mutateAsync({
          departmentId,
          data: {
            user_ids: removedUsers.map(user => user.user_id)
          }
        });
      }
    } catch (error) {
      console.error('Failed to update department users:', error);
    }
  };

  const isMobile = useIsMobile();

  if (isLoading) {
    return (
      <div className='p-4 sm:p-6 md:p-8 flex flex-col gap-6 h-full'>
        <div className='flex items-center gap-2'>
          <Skeleton className='h-8 w-8' />
          <Skeleton className='h-8 w-48' />
        </div>
        <ResizablePanelGroup direction='horizontal' className='flex-grow rounded-lg border'>
          <ResizablePanel defaultSize={25} minSize={25}>
            <DepartmentTreePanelSkeleton />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={75}>
            <div className='p-4'>
              <Skeleton className='h-full w-full' />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className='h-full w-full flex flex-col p-4 gap-4 overflow-hidden'>
        <div className='flex items-center gap-2 flex-shrink-0'>
          <Building2 />
          <h1 className='text-2xl font-bold'>{company?.company_name}</h1>
        </div>
        
        <div className='flex-1 border rounded-lg overflow-hidden'>
          <DepartmentTreePanel
            departments={departments}
            selectedDept={selectedDept}
            onDeptSelect={setSelectedDept}
            onDeptUpdate={() => {}}
            onDeptDelete={() => {}}
            companyId={company?.company_id || ''}
            title={t('department.list')}
            showAddButton={false}
            showNodeActions={false}
            disableCollapse={true}
          />
        </div>

        <Dialog 
          open={!!selectedDept} 
          onOpenChange={(open) => {
            if (!open) setSelectedDept(null);
          }}
        >
          <DialogContent className="w-full h-full max-w-none m-0 p-0 rounded-none border-none bg-background [&>button]:hidden flex flex-col">
            <div className="p-4 border-b flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setSelectedDept(null)}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h2 className="text-lg font-semibold">
                {selectedDept?.department_name}
              </h2>
            </div>
            <div className="flex-1 p-4 overflow-hidden">
              {selectedDept && (
                <UserDepartmentTransfer
                  key={selectedDept.department_id}
                  usersInDepartment={departmentUsers?.users_in_department || []}
                  usersNotInDepartment={departmentUsers?.users_not_in_department || []}
                  isLoading={isDepartmentUsersLoading}
                  isSaving={postDepartmentUsers.isPending || deleteDepartmentUsers.isPending}
                  onTransfer={handleTransfer}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className='h-full w-full'>
      <div className='h-full flex flex-col p-4 sm:p-6 md:p-8 gap-6 overflow-hidden'>
        <div className='flex items-center gap-2 flex-shrink-0'>
          <Building2 />
          <h1 className='text-3xl font-bold'>{company?.company_name}</h1>
        </div>
        <ResizablePanelGroup direction='horizontal' className='flex-1 min-h-0 rounded-lg border'>
          <ResizablePanel
            defaultSize={25}
            minSize={25}
            style={{ overflow: 'hidden' }}
          >
            <DepartmentTreePanel
              departments={departments}
              selectedDept={selectedDept}
              onDeptSelect={setSelectedDept}
              onDeptUpdate={() => {}}
              onDeptDelete={() => {}}
              companyId={company?.company_id || ''}
              title={t('department.list')}
              showAddButton={false}
              showNodeActions={false}
              disableCollapse={true}
            />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel
            defaultSize={75}
            style={{ overflow: 'hidden' }}
          >
            <div className='p-4 h-full'>
              {selectedDept ? (
                <UserDepartmentTransfer
                  key={selectedDept.department_id}
                  usersInDepartment={departmentUsers?.users_in_department || []}
                  usersNotInDepartment={departmentUsers?.users_not_in_department || []}
                  isLoading={isDepartmentUsersLoading}
                  isSaving={postDepartmentUsers.isPending || deleteDepartmentUsers.isPending}
                  onTransfer={handleTransfer}
                />
              ) : (
                <div className='flex items-center justify-center h-full text-muted-foreground'>
                  <p>{t('user.selectDepartment')}</p>
                </div>
              )}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export { DepartmentContent };
