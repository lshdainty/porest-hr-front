import { toast } from '@/components/alert/toast';
import QueryAsyncBoundary from '@/components/common/QueryAsyncBoundary';
import ExcelImportDialog from '@/components/report/ExcelImportDialog';
import ReportFilter, { FilterState } from '@/components/report/ReportFilter';
import ReportHeader from '@/components/report/ReportHeader';
import ReportSkeleton from '@/components/report/ReportSkeleton';
import ReportTable, { WorkHistory } from '@/components/report/ReportTable';
import { useUser } from '@/contexts/UserContext';
import { useUsersQuery } from '@/hooks/queries/useUsers';
import {
  useDeleteWorkHistoryMutation,
  usePostCreateWorkHistoryBatchMutation,
  usePostCreateWorkHistoryMutation,
  usePutUpdateWorkHistoryMutation,
  useWorkDivisionQuery,
  useWorkGroupsWithPartsQuery,
  useWorkHistoriesQuery,
  useWorkHistoryExcelDownloadMutation
} from '@/hooks/queries/useWorks';
import { type GetUsersResp } from '@/lib/api/user';
import { type WorkGroupWithParts, type WorkHistoryResp, type WorkHistorySearchCondition } from '@/lib/api/work';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

interface ReportContentProps {
  workGroupsWithParts: WorkGroupWithParts[];
  workDivision: any[];
  workHistoriesData: any[];
  users: GetUsersResp[];
  refetchWorkHistories: () => Promise<any>;
  loginUser: any;
  activeFilters: FilterState;
  handleSearch: () => void;
  handleResetFilters: () => void;
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: any) => void;
}

const ReportContent = ({
  workGroupsWithParts,
  workDivision,
  workHistoriesData,
  users,
  refetchWorkHistories,
  loginUser,
  activeFilters,
  handleSearch,
  handleResetFilters,
  filters,
  onFilterChange,
}: ReportContentProps) => {
  const createWorkHistory = usePostCreateWorkHistoryMutation();
  const updateWorkHistory = usePutUpdateWorkHistoryMutation();
  const deleteWorkHistory = useDeleteWorkHistoryMutation();

  const [workHistories, setWorkHistories] = useState<WorkHistory[]>([]);

  // 업무 이력 데이터를 받아와서 WorkHistory 형태로 변환
  useEffect(() => {
    if (workHistoriesData) {
      const convertedData: WorkHistory[] = workHistoriesData.map((item: WorkHistoryResp, index: number) => ({
        no: index + 1,
        work_history_seq: item.work_history_seq,
        date: item.work_date,
        manager_id: item.work_user_id,
        manager_name: item.work_user_name,
        work_group: item.work_group,
        work_part: item.work_part,
        work_division: item.work_class, // 백엔드의 work_class를 프론트의 work_division으로 매핑
        hours: item.work_hour,
        content: item.work_content,
      }));
      setWorkHistories(convertedData);
    }
  }, [workHistoriesData]);

  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editData, setEditData] = useState<WorkHistory | null>(null);

  // 필터 상태
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(workHistories.map((row) => row.no));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (no: number, checked: boolean) => {
    if (checked) {
      setSelectedRows([...selectedRows, no]);
    } else {
      setSelectedRows(selectedRows.filter((rowNo) => rowNo !== no));
    }
  };

  const handleAddRow = () => {
    const maxNo = workHistories.length > 0 ? Math.max(...workHistories.map((item) => item.no)) : 0;
    const newRow: WorkHistory = {
      no: maxNo + 1,
      work_history_seq: undefined, // 신규 행
      date: dayjs().format('YYYY-MM-DD'),
      manager_id: loginUser?.user_id || '',
      manager_name: loginUser?.user_name || '',
      work_group: undefined,
      work_part: undefined,
      work_division: undefined,
      hours: 0,
      content: '',
    };
    setWorkHistories([...workHistories, newRow]);
    setEditingRow(newRow.no);
    setEditData(newRow);
  };

  const handleEdit = (row: WorkHistory) => {
    // 수정 모드 진입 시 해당 row의 업무 분류에 해당하는 업무 파트 옵션 조회
    setEditingRow(row.no);
    setEditData({ ...row });
  };

  const handleSave = async () => {
    if (!editData) return;

    // 필수 값 검증 - 상세 메시지
    const missingFields: string[] = [];

    if (!editData.date) missingFields.push('일자');
    if (!editData.work_group) missingFields.push('업무 분류');
    if (!editData.work_part) missingFields.push('업무 파트');
    if (!editData.work_division) missingFields.push('업무 구분');

    if (missingFields.length > 0) {
      toast.error(`다음 필드를 입력해주세요: ${missingFields.join(', ')}`);
      console.log('editData:', editData); // 디버깅용
      return;
    }

    try {
      const isNew = !editData.work_history_seq;

      if (isNew) {
        // 신규 등록 - 검증 완료 후이므로 non-null assertion 사용
        await createWorkHistory.mutateAsync({
          work_date: editData.date,
          work_user_id: editData.manager_id,
          work_group_code: editData.work_group!.work_code,
          work_part_code: editData.work_part!.work_code,
          work_class_code: editData.work_division!.work_code,
          work_hour: Number(editData.hours) || 0,
          work_content: editData.content,
        });
      } else {
        // 수정 - 검증 완료 후이므로 non-null assertion 사용
        await updateWorkHistory.mutateAsync({
          work_history_seq: editData.work_history_seq!,
          work_date: editData.date,
          work_user_id: editData.manager_id,
          work_group_code: editData.work_group!.work_code,
          work_part_code: editData.work_part!.work_code,
          work_class_code: editData.work_division!.work_code,
          work_hour: Number(editData.hours) || 0,
          work_content: editData.content,
        });
      }

      // 성공 시 서버에서 최신 데이터 다시 조회
      await refetchWorkHistories();

      setEditingRow(null);
      setEditData(null);
      toast.success('저장되었습니다.');
    } catch (error) {
      console.error('저장 실패:', error);
      toast.error('저장에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleCancel = () => {
    // 신규 행이었다면 목록에서 제거
    if (editData && !editData.work_history_seq) {
      setWorkHistories(workHistories.filter((item) => item.no !== editData.no));
    }
    setEditingRow(null);
    setEditData(null);
  };

  const handleDuplicate = async (row: WorkHistory) => {
    // 필수 값 검증
    if (!row.work_group || !row.work_part || !row.work_division) {
      toast.error('복제할 데이터가 유효하지 않습니다.');
      return;
    }

    try {
      // 오늘 날짜로 변경하여 바로 등록
      await createWorkHistory.mutateAsync({
        work_date: dayjs().format('YYYY-MM-DD'), // 오늘 날짜로 변경
        work_user_id: loginUser?.user_id || row.manager_id,
        work_group_code: row.work_group.work_code,
        work_part_code: row.work_part.work_code,
        work_class_code: row.work_division.work_code,
        work_hour: Number(row.hours) || 0,
        work_content: row.content,
      });

      // 성공 시 서버에서 최신 데이터 다시 조회
      await refetchWorkHistories();

      toast.success('복제가 완료되었습니다.');
    } catch (error) {
      console.error('복제 실패:', error);
      toast.error('복제에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleDuplicateSelected = async () => {
    if (selectedRows.length === 0) return;

    const selectedWorkHistories = workHistories.filter((row) =>
      selectedRows.includes(row.no)
    );

    // 필수 값 검증
    const invalidRows = selectedWorkHistories.filter(
      (row) => !row.work_group || !row.work_part || !row.work_division
    );

    if (invalidRows.length > 0) {
      toast.error('복제할 데이터 중 유효하지 않은 항목이 있습니다.');
      return;
    }

    try {
      // 선택된 모든 행을 오늘 날짜로 변경하여 등록
      const promises = selectedWorkHistories.map((row) =>
        createWorkHistory.mutateAsync({
          work_date: dayjs().format('YYYY-MM-DD'), // 오늘 날짜로 변경
          work_user_id: loginUser?.user_id || row.manager_id,
          work_group_code: row.work_group!.work_code,
          work_part_code: row.work_part!.work_code,
          work_class_code: row.work_division!.work_code,
          work_hour: Number(row.hours) || 0,
          work_content: row.content,
        })
      );

      await Promise.all(promises);

      // 성공 시 서버에서 최신 데이터 다시 조회
      await refetchWorkHistories();

      setSelectedRows([]);
      toast.success(`${selectedWorkHistories.length}개의 항목이 복제되었습니다.`);
    } catch (error) {
      console.error('복제 실패:', error);
      toast.error('복제에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleDelete = async (row: WorkHistory) => {
    // 신규 행(아직 저장되지 않은 행)은 로컬에서만 제거
    if (!row.work_history_seq) {
      setWorkHistories(workHistories.filter((item) => item.no !== row.no));
      setSelectedRows(selectedRows.filter((rowNo) => rowNo !== row.no));
      return;
    }

    try {
      // 서버에서 삭제
      await deleteWorkHistory.mutateAsync(row.work_history_seq);

      // 성공 시 서버에서 최신 데이터 다시 조회
      await refetchWorkHistories();

      toast.success('삭제되었습니다.');
    } catch (error) {
      console.error('삭제 실패:', error);
      toast.error('삭제에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const updateEditData = (field: keyof WorkHistory, value: any) => {
    setEditData((prev) => prev ? { ...prev, [field]: value } : null);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (activeFilters.startDate) count++;
    if (activeFilters.endDate) count++;
    if (activeFilters.filterName) count++;
    if (activeFilters.sortOrder !== 'latest') count++;
    if (activeFilters.selectedWorkGroup !== 'all') count++;
    if (activeFilters.selectedWorkPart !== 'all') count++;
    if (activeFilters.selectedWorkDivision !== 'all') count++;
    return count;
  };

  // 엑셀 관련 함수
  const [isExcelImportOpen, setIsExcelImportOpen] = useState(false);

  const createWorkHistoryBatch = usePostCreateWorkHistoryBatchMutation();
  const downloadWorkHistoryExcel = useWorkHistoryExcelDownloadMutation();

  const handleExcelImport = () => {
    setIsExcelImportOpen(true);
  };

  const handleExcelImportOpenChange = (open: boolean) => {
    setIsExcelImportOpen(open);
  };

  const handleBatchRegister = async (data: any[]) => {
    try {
      await createWorkHistoryBatch.mutateAsync(data);
      await refetchWorkHistories();
      toast.success('일괄 등록이 완료되었습니다.');
    } catch (error) {
      console.error('일괄 등록 실패:', error);
      toast.error('일괄 등록에 실패했습니다.');
    }
  };

  const handleExcelExport = async () => {
    try {
      // 현재 필터 조건으로 엑셀 다운로드 요청
      const searchCondition: WorkHistorySearchCondition = {
        startDate: activeFilters.startDate ? dayjs(activeFilters.startDate).format('YYYY-MM-DD') : undefined,
        endDate: activeFilters.endDate ? dayjs(activeFilters.endDate).format('YYYY-MM-DD') : undefined,
        userId: activeFilters.filterName && activeFilters.filterName !== 'all' ? activeFilters.filterName : undefined,
        groupSeq: activeFilters.selectedWorkGroup !== 'all' 
          ? workGroupsWithParts?.find(g => g.work_code === activeFilters.selectedWorkGroup)?.work_code_seq 
          : undefined,
        partSeq: activeFilters.selectedWorkPart !== 'all'
          ? workGroupsWithParts?.flatMap(g => g.parts).find(p => p.work_code === activeFilters.selectedWorkPart)?.work_code_seq
          : undefined,
        divisionSeq: activeFilters.selectedWorkDivision !== 'all'
          ? workDivision?.find(d => d.work_code === activeFilters.selectedWorkDivision)?.work_code_seq
          : undefined,
        sortType: activeFilters.sortOrder === 'latest' ? 'LATEST' : 'OLDEST',
      };

      const blob = await downloadWorkHistoryExcel.mutateAsync(searchCondition);

      // 파일 다운로드 처리
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `업무이력_${dayjs().format('YYYYMMDD')}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('엑셀 다운로드 실패:', error);
      toast.error('엑셀 다운로드에 실패했습니다.');
    }
  };

  const handleDownloadTemplate = () => {
    console.log('예시 파일 다운로드');
    // 예시 파일 다운로드 로직 구현
  };

  const handleDownloadUnregistered = () => {
    console.log('미등록 리스트 다운로드');
    // 미등록 리스트 다운로드 로직 구현
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className='p-4 sm:p-6 md:p-8'>
      <ReportHeader
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
        activeFiltersCount={activeFiltersCount}
        handleExcelImport={handleExcelImport}
        handleExcelExport={handleExcelExport}
        handleDownloadTemplate={handleDownloadTemplate}
        handleDownloadUnregistered={handleDownloadUnregistered}
      />

      <ReportFilter
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
        activeFiltersCount={activeFiltersCount}
        handleResetFilters={handleResetFilters}
        filters={filters}
        onFilterChange={onFilterChange}
        handleSearch={handleSearch}
        workGroups={workGroupsWithParts}
        workDivision={workDivision}
        users={users}
      />

      <div className="mt-6">
        <ReportTable
          workHistories={workHistories}
          isWorkHistoriesLoading={false} // QueryAsyncBoundary가 로딩을 처리하므로 여기서는 false
          selectedRows={selectedRows}
          handleSelectAll={handleSelectAll}
          handleSelectRow={handleSelectRow}
          handleAddRow={handleAddRow}
          handleDuplicateSelected={handleDuplicateSelected}
          editingRow={editingRow}
          editData={editData}
          setEditData={setEditData}
          updateEditData={updateEditData}
          handleSave={handleSave}
          handleCancel={handleCancel}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          handleDuplicate={handleDuplicate}
          workGroups={workGroupsWithParts}
          isWorkGroupsLoading={false} // QueryAsyncBoundary가 로딩을 처리하므로 여기서는 false
          workDivision={workDivision}
          isWorkDivisionLoading={false} // QueryAsyncBoundary가 로딩을 처리하므로 여기서는 false
        />
      </div>

      <ExcelImportDialog
        open={isExcelImportOpen}
        onOpenChange={handleExcelImportOpenChange}
        workGroups={workGroupsWithParts}
        workDivision={workDivision}
        onRegister={handleBatchRegister}
        isRegistering={createWorkHistoryBatch.isPending}
      />
    </div>
  );
};

export default function Report() {
  const { loginUser } = useUser();
  const { data: workGroupsWithParts, isLoading: isWorkGroupsLoading, error: workGroupsError } = useWorkGroupsWithPartsQuery();
  const { data: workDivision, isLoading: isWorkDivisionLoading, error: workDivisionError } = useWorkDivisionQuery();
  const { data: users, isLoading: isUsersLoading, error: usersError } = useUsersQuery();

  // 필터 상태 관리 (Report 컴포넌트로 이동)
  const [filters, setFilters] = useState<FilterState>({
    startDate: dayjs().subtract(1, 'month').toDate(),
    endDate: dayjs().toDate(),
    filterName: '',
    sortOrder: 'latest',
    selectedWorkGroup: 'all',
    selectedWorkPart: 'all',
    selectedWorkDivision: 'all',
  });

  // 실제 적용된 필터 상태 (조회 버튼 클릭 시 업데이트)
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    startDate: dayjs().subtract(1, 'month').toDate(),
    endDate: dayjs().toDate(),
    filterName: '',
    sortOrder: 'latest',
    selectedWorkGroup: 'all',
    selectedWorkPart: 'all',
    selectedWorkDivision: 'all',
  });

  // 검색 조건 생성
  const searchCondition: WorkHistorySearchCondition = {
    startDate: activeFilters.startDate ? dayjs(activeFilters.startDate).format('YYYY-MM-DD') : undefined,
    endDate: activeFilters.endDate ? dayjs(activeFilters.endDate).format('YYYY-MM-DD') : undefined,
    userId: activeFilters.filterName && activeFilters.filterName !== 'all' ? activeFilters.filterName : undefined,
    groupSeq: activeFilters.selectedWorkGroup !== 'all' 
      ? workGroupsWithParts?.find(g => g.work_code === activeFilters.selectedWorkGroup)?.work_code_seq 
      : undefined,
    partSeq: activeFilters.selectedWorkPart !== 'all'
      ? workGroupsWithParts?.flatMap(g => g.parts).find(p => p.work_code === activeFilters.selectedWorkPart)?.work_code_seq
      : undefined,
    divisionSeq: activeFilters.selectedWorkDivision !== 'all'
      ? workDivision?.find(d => d.work_code === activeFilters.selectedWorkDivision)?.work_code_seq
      : undefined,
    sortType: activeFilters.sortOrder === 'latest' ? 'LATEST' : 'OLDEST',
  };

  const { data: workHistoriesData, isLoading: isWorkHistoriesLoading, error: workHistoriesError, refetch: refetchWorkHistories } = useWorkHistoriesQuery(searchCondition);

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSearch = () => {
    setActiveFilters(filters);
  };

  const handleResetFilters = () => {
    const initialFilters: FilterState = {
      startDate: dayjs().subtract(1, 'month').toDate(),
      endDate: dayjs().toDate(),
      filterName: '',
      sortOrder: 'latest',
      selectedWorkGroup: 'all',
      selectedWorkPart: 'all',
      selectedWorkDivision: 'all',
    };
    
    setFilters(initialFilters);
    setActiveFilters(initialFilters);
  };

  console.log('workGroupsWithParts:', workGroupsWithParts);

  const isLoading = isWorkGroupsLoading || isWorkDivisionLoading || isWorkHistoriesLoading || isUsersLoading;
  const error = workGroupsError || workDivisionError || workHistoriesError || usersError;

  return (
    <QueryAsyncBoundary
      queryState={{ isLoading, error, data: workHistoriesData }}
      loadingComponent={<ReportSkeleton />}
      errorComponent={
        <div className='p-4 sm:p-6 md:p-8'>
          <div className='p-8 text-center text-red-600'>
            데이터를 불러오는데 실패했습니다.
          </div>
        </div>
      }
    >
      <ReportContent
        workGroupsWithParts={workGroupsWithParts || []}
        workDivision={workDivision || []}
        workHistoriesData={workHistoriesData || []}
        users={users || []}
        refetchWorkHistories={refetchWorkHistories}
        loginUser={loginUser}
        activeFilters={activeFilters}
        handleSearch={handleSearch}
        handleResetFilters={handleResetFilters}
        filters={filters}
        onFilterChange={handleFilterChange}
      />
    </QueryAsyncBoundary>
  );
}
