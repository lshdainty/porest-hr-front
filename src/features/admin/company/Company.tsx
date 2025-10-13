import { useState, useMemo } from 'react';
import CompanyCreateCard from '@/components/company/CompanyCreateCard';
import DepartmentTreePanel from '@/components/company/DepartmentTreePanel';
import DepartmentChartPanel from '@/components/company/DepartmentChartPanel';
import DepartmentTreePanelSkeleton from '@/components/company/DepartmentTreePanelSkeleton';
import DepartmentChartPanelSkeleton from '@/components/company/DepartmentChartPanelSkeleton';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/shadcn/resizable";
import { Building2 } from 'lucide-react';
import { useGetCompany, usePostCompany, useGetCompanyWithDepartments, type PostCompanyReq } from '@/api/company';
import { usePostDepartment, usePutDepartment, useDeleteDepartment, type PostDepartmentReq, type PutDepartmentReq } from '@/api/department';
import { Skeleton } from '@/components/shadcn/skeleton';


export default function Company() {
  const [selectedDept, setSelectedDept] = useState<any | null>(null);

  const { data: company, isLoading } = useGetCompany();
  const { data: companyWithDepartments } = useGetCompanyWithDepartments({
    company_id: company?.company_id ?? ''
  });
  const { mutate: createCompany } = usePostCompany();
  const { mutate: createDepartment } = usePostDepartment();
  const { mutate: updateDepartment } = usePutDepartment();
  const { mutate: deleteDepartment } = useDeleteDepartment();

  const departments = useMemo(() => {
    return companyWithDepartments?.departments || [];
  }, [companyWithDepartments]);

  const handleCompanyCreate = (companyFormData: PostCompanyReq) => {
    createCompany(companyFormData);
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
      <div className="p-4 sm:p-6 md:p-8 flex flex-col gap-6 h-full">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-48" />
        </div>
        <ResizablePanelGroup direction="horizontal" className="flex-grow rounded-lg border" storage={null}>
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

  // 회사 정보가 없을 때 회사 생성 화면 표시
  if (!company) {
    return (
      <div className='flex-1 flex items-center justify-center'>
        <CompanyCreateCard onCompanyCreate={handleCompanyCreate} />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 flex flex-col gap-6 h-full">
      <div className="flex items-center gap-2">
        <Building2 />
        <h1 className="text-3xl font-bold">{company.company_name}</h1>
      </div>
      <ResizablePanelGroup direction="horizontal" className="flex-grow rounded-lg border" storage={null}>
        <ResizablePanel defaultSize={25} minSize={25}>
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
        <ResizablePanel defaultSize={75}>
          <DepartmentChartPanel
            departments={departments}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
