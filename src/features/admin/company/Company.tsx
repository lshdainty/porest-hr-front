import { useCompanyQuery, useCompanyWithDepartmentsQuery, usePostCompanyMutation, usePutCompanyMutation } from '@/hooks/queries/useCompanies';
import { type PostCompanyReq, type PutCompanyReq } from '@/lib/api/company';
import { useDeleteDepartmentMutation, usePostDepartmentMutation, usePutDepartmentMutation } from '@/hooks/queries/useDepartments';
import { type PostDepartmentReq, type PutDepartmentReq } from '@/lib/api/department';
import CompanyCreateCard from '@/components/company/CompanyCreateCard';
import CompanyFormDialog from '@/components/company/CompanyFormDialog';
import DepartmentChartPanel from '@/components/company/DepartmentChartPanel';
import DepartmentChartPanelSkeleton from '@/components/company/DepartmentChartPanelSkeleton';
import DepartmentTreePanel from '@/components/company/DepartmentTreePanel';
import DepartmentTreePanelSkeleton from '@/components/company/DepartmentTreePanelSkeleton';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/shadcn/resizable';
import { Skeleton } from '@/components/shadcn/skeleton';
import { Building2, Pencil } from 'lucide-react';
import { useMemo, useState } from 'react';


export default function Company() {
  const [selectedDept, setSelectedDept] = useState<any | null>(null);
  const [isCompanyEditDialogOpen, setIsCompanyEditDialogOpen] = useState(false);

  const { data: company, isLoading } = useCompanyQuery();
  const { data: companyWithDepartments } = useCompanyWithDepartmentsQuery(company?.company_id ?? '');
  const { mutate: createCompany } = usePostCompanyMutation();
  const { mutate: updateCompany } = usePutCompanyMutation();
  const { mutate: createDepartment } = usePostDepartmentMutation();
  const { mutate: updateDepartment } = usePutDepartmentMutation();
  const { mutate: deleteDepartment } = useDeleteDepartmentMutation();

  const departments = useMemo(() => {
    return companyWithDepartments?.departments || [];
  }, [companyWithDepartments]);

  const handleCompanyCreate = (companyFormData: PostCompanyReq) => {
    createCompany(companyFormData);
  };

  const handleCompanySave = (formData: PostCompanyReq | { companyId: string; data: PutCompanyReq }) => {
    if ('companyId' in formData) {
      // 수정 모드
      updateCompany(formData, {
        onSuccess: () => {
          setIsCompanyEditDialogOpen(false);
        }
      });
    } else {
      // 생성 모드 (필요시)
      createCompany(formData);
    }
  };

  const handleDeptUpdate = (formData: PostDepartmentReq | { departmentId: number; data: PutDepartmentReq }) => {
    if ('departmentId' in formData) {
      // 수정 모드
      updateDepartment(formData);
    } else {
      // 생성 모드
      const createData: PostDepartmentReq = {
        ...formData,
        company_id: company?.company_id || ''
      };
      createDepartment(createData);
    }
  };

  const handleDeptDelete = (deptId: number) => {
    deleteDepartment(deptId);
  };

  if (isLoading) {
    return (
      <div className='p-4 sm:p-6 md:p-8 flex flex-col gap-6 h-full'>
        <div className='flex items-center gap-2'>
          <Skeleton className='h-8 w-8' />
          <Skeleton className='h-8 w-48' />
        </div>
        <ResizablePanelGroup direction='horizontal' className='flex-grow rounded-lg border' storage={null}>
          <ResizablePanel defaultSize={25} minSize={25}>
            <DepartmentTreePanelSkeleton />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={75}>
            <DepartmentChartPanelSkeleton />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    );
  }

  if (!company) {
    return (
      <div className='h-full flex items-center justify-center overflow-hidden'>
        <CompanyCreateCard onCompanyCreate={handleCompanyCreate} />
      </div>
    );
  }

  return (
    <div className='h-full w-full'>
    <div className='h-full flex flex-col p-4 sm:p-6 md:p-8 gap-6 overflow-hidden'>
      <div className='flex items-center gap-2 flex-shrink-0'>
        <Building2 />
        <h1 className='text-3xl font-bold'>{company.company_name}</h1>
        <div
          onClick={() => setIsCompanyEditDialogOpen(true)}
          className='cursor-pointer p-1 rounded hover:bg-accent transition-colors'
        >
          <Pencil className='h-4 w-4' />
        </div>
      </div>

      <CompanyFormDialog
        isOpen={isCompanyEditDialogOpen}
        onOpenChange={setIsCompanyEditDialogOpen}
        onSave={handleCompanySave}
        initialData={{
          company_id: company.company_id,
          company_name: company.company_name,
          company_desc: company.company_desc
        }}
        mode='edit'
      />
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
            onDeptUpdate={handleDeptUpdate}
            onDeptDelete={handleDeptDelete}
            companyId={company?.company_id || ''}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel 
          defaultSize={75}
          style={{ overflow: 'hidden' }}
        >
          <DepartmentChartPanel
            departments={departments}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
    </div>
  );
}
