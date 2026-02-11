import QueryAsyncBoundary from '@/shared/ui/async-boundary/QueryAsyncBoundary';
import { DepartmentChartPanel } from '@/features/admin-company/ui/DepartmentChartPanel';
import { DepartmentChartPanelSkeleton } from '@/features/admin-company/ui/DepartmentChartPanelSkeleton';
import { EmptyDepartment } from '@/features/admin-company/ui/EmptyDepartment';
import { useCompanyQuery, useCompanyWithDepartmentsQuery } from '@/entities/company';

export const DepartmentChartWidget = () => {
  const { data: company, isLoading: companyLoading, error: companyError } = useCompanyQuery();

  const companyId = company?.company_id || '';

  const {
    data: companyWithDepartments,
    isLoading: departmentsLoading,
    error: departmentsError
  } = useCompanyWithDepartmentsQuery(companyId);

  const isLoading = companyLoading || departmentsLoading;
  const error = companyError || departmentsError;

  const departments = companyWithDepartments?.departments || [];

  return (
    <QueryAsyncBoundary
      queryState={{ isLoading, error, data: companyWithDepartments }}
      loadingComponent={<DepartmentChartPanelSkeleton />}
      emptyComponent={<EmptyDepartment className="h-full" />}
      isEmpty={(data) => !data || !data.departments || data.departments.length === 0}
    >
      <DepartmentChartPanel departments={departments} showHeader={false} />
    </QueryAsyncBoundary>
  );
};
