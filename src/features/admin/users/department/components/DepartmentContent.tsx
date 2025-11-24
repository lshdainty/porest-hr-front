import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/shadcn/resizable';
import { Skeleton } from '@/components/shadcn/skeleton';
import DepartmentTreePanel from '@/features/admin/company/components/DepartmentTreePanel';
import DepartmentTreePanelSkeleton from '@/features/admin/company/components/DepartmentTreePanelSkeleton';
import { useCompanyQuery, useCompanyWithDepartmentsQuery } from '@/hooks/queries/useCompanies';
import { useDeleteDepartmentUsersMutation, useDepartmentUsersQuery, usePostDepartmentUsersMutation } from '@/hooks/queries/useDepartments';
import { type UserInfo } from '@/lib/api/department';
import { Building2 } from 'lucide-react';
import { useMemo } from 'react';
import { useDepartmentContext } from '@/features/admin/users/department/contexts/DepartmentContext';
import UserDepartmentTransfer from '@/features/admin/users/department/components/UserDepartmentTransfer';

const DepartmentContent = () => {
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
              title="부서 목록"
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
                  onTransfer={handleTransfer}
                />
              ) : (
                <div className='flex items-center justify-center h-full text-muted-foreground'>
                  <p>부서를 선택하세요</p>
                </div>
              )}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default DepartmentContent;
