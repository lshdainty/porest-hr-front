import { toast } from '@/components/alert/toast';
import QueryAsyncBoundary from '@/components/common/QueryAsyncBoundary';
import { useUser } from '@/contexts/UserContext';
import ExcelImportDialog from '@/features/work/report/components/ExcelImportDialog';
import ReportFilter from '@/features/work/report/components/ReportFilter';
import ReportHeader from '@/features/work/report/components/ReportHeader';
import ReportSkeleton from '@/features/work/report/components/ReportSkeleton';
import ReportTable from '@/features/work/report/components/ReportTable';
import UnregisteredDownloadDialog from '@/features/work/report/components/UnregisteredDownloadDialog';
import { useReportContext } from '@/features/work/report/contexts/ReportContext';
import { WorkHistory } from '@/features/work/report/types';
import { useUsersQuery } from '@/hooks/queries/useUsers';
import {
  useBulkCreateWorkHistoriesMutation,
  useDeleteWorkHistoryMutation,
  usePostCreateWorkHistoryMutation,
  usePutUpdateWorkHistoryMutation,
  useWorkDivisionQuery,
  useWorkGroupsWithPartsQuery,
  useWorkHistoriesQuery,
  useWorkHistoryExcelDownloadMutation
} from '@/hooks/queries/useWorks';
import { WorkHistoryResp, WorkHistorySearchCondition } from '@/lib/api/work';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

const ReportContent = () => {
  const { loginUser } = useUser();
  const {
    activeFilters,
    selectedRows,
    setSelectedRows,
    setEditingRow,
    setEditData,
    editData,
    isExcelImportOpen,
    setIsExcelImportOpen,
  } = useReportContext();

  // Data Fetching
  const { data: workGroupsWithParts, isLoading: isWorkGroupsLoading, error: workGroupsError } = useWorkGroupsWithPartsQuery();
  const { data: workDivision, isLoading: isWorkDivisionLoading, error: workDivisionError } = useWorkDivisionQuery();
  const { data: users, isLoading: isUsersLoading, error: usersError } = useUsersQuery();

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

  // Mutations
  const createWorkHistory = usePostCreateWorkHistoryMutation();
  const updateWorkHistory = usePutUpdateWorkHistoryMutation();
  const deleteWorkHistory = useDeleteWorkHistoryMutation();
  const createWorkHistoryBatch = useBulkCreateWorkHistoriesMutation();
  const downloadWorkHistoryExcel = useWorkHistoryExcelDownloadMutation();

  // Local State for Table Data (converted from API response)
  const [workHistories, setWorkHistories] = useState<WorkHistory[]>([]);

  // Unregistered Hours Download Dialog State
  const [isUnregisteredDialogOpen, setIsUnregisteredDialogOpen] = useState(false);

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
        work_division: item.work_class,
        hours: item.work_hour,
        content: item.work_content,
      }));
      setWorkHistories(convertedData);
    }
  }, [workHistoriesData]);

  // Handlers
  const handleAddRow = () => {
    const maxNo = workHistories.length > 0 ? Math.max(...workHistories.map((item) => item.no)) : 0;
    const newRow: WorkHistory = {
      no: maxNo + 1,
      work_history_seq: undefined,
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
    setEditingRow(row.no);
    setEditData({ ...row });
  };

  const handleSave = async () => {
    if (!editData) return;

    const missingFields: string[] = [];
    if (!editData.date) missingFields.push('일자');
    if (!editData.work_group) missingFields.push('업무 분류');
    if (!editData.work_part) missingFields.push('업무 파트');
    if (!editData.work_division) missingFields.push('업무 구분');

    if (missingFields.length > 0) {
      toast.error(`다음 필드를 입력해주세요: ${missingFields.join(', ')}`);
      return;
    }

    try {
      const isNew = !editData.work_history_seq;

      if (isNew) {
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

      await refetchWorkHistories();
      setEditingRow(null);
      setEditData(null);
    } catch (error) {
      console.error('저장 실패:', error);
      toast.error('저장에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleCancel = () => {
    if (editData && !editData.work_history_seq) {
      setWorkHistories(workHistories.filter((item) => item.no !== editData.no));
    }
    setEditingRow(null);
    setEditData(null);
  };

  const handleDuplicate = async (row: WorkHistory) => {
    if (!row.work_group || !row.work_part || !row.work_division) {
      toast.error('복제할 데이터가 유효하지 않습니다.');
      return;
    }

    try {
      await createWorkHistory.mutateAsync({
        work_date: dayjs().format('YYYY-MM-DD'),
        work_user_id: loginUser?.user_id || row.manager_id,
        work_group_code: row.work_group.work_code,
        work_part_code: row.work_part.work_code,
        work_class_code: row.work_division.work_code,
        work_hour: Number(row.hours) || 0,
        work_content: row.content,
      });

      await refetchWorkHistories();
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

    const invalidRows = selectedWorkHistories.filter(
      (row) => !row.work_group || !row.work_part || !row.work_division
    );

    if (invalidRows.length > 0) {
      toast.error('복제할 데이터 중 유효하지 않은 항목이 있습니다.');
      return;
    }

    try {
      const promises = selectedWorkHistories.map((row) =>
        createWorkHistory.mutateAsync({
          work_date: dayjs().format('YYYY-MM-DD'),
          work_user_id: loginUser?.user_id || row.manager_id,
          work_group_code: row.work_group!.work_code,
          work_part_code: row.work_part!.work_code,
          work_class_code: row.work_division!.work_code,
          work_hour: Number(row.hours) || 0,
          work_content: row.content,
        })
      );

      await Promise.all(promises);
      await refetchWorkHistories();
      setSelectedRows([]);
    } catch (error) {
      console.error('복제 실패:', error);
      toast.error('복제에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleDelete = async (row: WorkHistory) => {
    if (!row.work_history_seq) {
      setWorkHistories(workHistories.filter((item) => item.no !== row.no));
      setSelectedRows(selectedRows.filter((rowNo) => rowNo !== row.no));
      return;
    }

    try {
      await deleteWorkHistory.mutateAsync(row.work_history_seq);
      await refetchWorkHistories();
    } catch (error) {
      console.error('삭제 실패:', error);
      toast.error('삭제에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // Excel Handlers
  const handleExcelImport = () => setIsExcelImportOpen(true);
  
  const handleBatchRegister = async (data: any[]) => {
    try {
      await createWorkHistoryBatch.mutateAsync({ work_histories: data });
      await refetchWorkHistories();
    } catch (error) {
      console.error('일괄 등록 실패:', error);
      toast.error('일괄 등록에 실패했습니다.');
    }
  };

  const handleExcelExport = async () => {
    try {
      const blob = await downloadWorkHistoryExcel.mutateAsync(searchCondition);
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

  const handleDownloadTemplate = () => console.log('예시 파일 다운로드');

  const handleDownloadUnregistered = () => {
    setIsUnregisteredDialogOpen(true);
  };

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
      <div className='p-4 sm:p-6 md:p-8'>
        <ReportHeader
          handleExcelImport={handleExcelImport}
          handleExcelExport={handleExcelExport}
          handleDownloadTemplate={handleDownloadTemplate}
          handleDownloadUnregistered={handleDownloadUnregistered}
        />

        <ReportFilter
          workGroups={workGroupsWithParts || []}
          workDivision={workDivision || []}
          users={users || []}
        />

        <div className='mt-6'>
          <ReportTable
            workHistories={workHistories}
            isWorkHistoriesLoading={false}
            handleAddRow={handleAddRow}
            handleDuplicateSelected={handleDuplicateSelected}
            handleSave={handleSave}
            handleCancel={handleCancel}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            handleDuplicate={handleDuplicate}
            workGroups={workGroupsWithParts || []}
            isWorkGroupsLoading={false}
            workDivision={workDivision}
            isWorkDivisionLoading={false}
          />
        </div>

        <ExcelImportDialog
          open={isExcelImportOpen}
          onOpenChange={setIsExcelImportOpen}
          workGroups={workGroupsWithParts || []}
          workDivision={workDivision || []}
          users={users || []}
          onRegister={handleBatchRegister}
          isRegistering={createWorkHistoryBatch.isPending}
        />

        <UnregisteredDownloadDialog
          open={isUnregisteredDialogOpen}
          onOpenChange={setIsUnregisteredDialogOpen}
        />
      </div>
    </QueryAsyncBoundary>
  );
}

export default ReportContent;
