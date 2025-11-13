import { useCreateWorkHistory, useGetWorkDivision, useGetWorkGroups, useGetWorkPartLabel, useGetWorkParts, useGetWorkHistories, useUpdateWorkHistory, useDeleteWorkHistory, type WorkCodeResp, type WorkHistoryResp } from '@/api/work';
import { toast } from '@/components/alert/toast';
import { Badge } from '@/components/shadcn/badge';
import { Button } from '@/components/shadcn/button';
import { Calendar } from '@/components/shadcn/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card';
import { Checkbox } from '@/components/shadcn/checkbox';
import {
  Collapsible,
  CollapsibleContent
} from '@/components/shadcn/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/shadcn/dropdownMenu';
import { Input } from '@/components/shadcn/input';
import { Label } from '@/components/shadcn/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/shadcn/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shadcn/table';
import { Textarea } from '@/components/shadcn/textarea';
import { cn } from '@/lib/utils';
import { useLoginUserStore } from '@/store/LoginUser';
import { Empty } from 'antd';
import dayjs from 'dayjs';
import {
  CalendarIcon,
  ChevronDown,
  Copy,
  Download,
  EllipsisVertical,
  FileDown,
  FileUp,
  Filter,
  Pencil,
  Plus,
  Search,
  Trash2,
  X
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface WorkHistory {
  no: number;
  work_history_seq?: number;
  date: string;
  manager_id: string;
  manager_name: string;
  work_group?: WorkCodeResp;
  work_part?: WorkCodeResp;
  work_division?: WorkCodeResp;
  hours: number;
  content: string;
}

export default function Report() {
  const { loginUser } = useLoginUserStore();
  const { data: workGroups, isLoading: isWorkGroupsLoading } = useGetWorkGroups();
  const { data: workDivision, isLoading: isWorkDivisionLoading } = useGetWorkDivision();
  const { data: workHistoriesData, isLoading: isWorkHistoriesLoading, refetch: refetchWorkHistories } = useGetWorkHistories();

  const createWorkHistory = useCreateWorkHistory();
  const updateWorkHistory = useUpdateWorkHistory();
  const deleteWorkHistory = useDeleteWorkHistory();

  // 선택된 업무 분류의 seq를 저장
  const [selectedCategorySeq, setSelectedCategorySeq] = useState<number>(0);
  // 조회된 work_part label의 seq를 저장
  const [workPartLabelSeq, setWorkPartLabelSeq] = useState<number>(0);

  // 1단계: 선택된 업무 분류의 하위 LABEL(work_part) 조회
  const { data: workPartLabels } = useGetWorkPartLabel({
    parent_work_code_seq: selectedCategorySeq
  });

  // 2단계: work_part label의 하위 OPTION 조회
  const { data: workPartOptions, isLoading: isWorkPartOptionsLoading } = useGetWorkParts({
    parent_work_code_seq: workPartLabelSeq
  });

  // workPartLabels가 조회되면 첫 번째 label의 seq를 저장
  useEffect(() => {
    if (workPartLabels && workPartLabels.length > 0) {
      setWorkPartLabelSeq(workPartLabels[0].work_code_seq);
    } else {
      setWorkPartLabelSeq(0);
    }
  }, [workPartLabels]);

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
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [filterName, setFilterName] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('latest');

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
    if (row.work_group) {
      setSelectedCategorySeq(row.work_group.work_code_seq);
    }
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
          work_hour: editData.hours,
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
          work_hour: editData.hours,
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
        work_hour: row.hours,
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
          work_hour: row.hours,
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
      await deleteWorkHistory.mutateAsync({
        work_history_seq: row.work_history_seq
      });

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

  // 필터 및 정렬 함수
  const handleSearch = () => {
    console.log('검색:', { startDate, endDate, filterName, sortOrder });
    // 실제 필터링 로직 구현
  };

  const handleResetFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setFilterName('');
    setSortOrder('latest');
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (startDate) count++;
    if (endDate) count++;
    if (filterName) count++;
    if (sortOrder !== 'latest') count++;
    return count;
  };

  // 엑셀 관련 함수
  const handleExcelImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('엑셀 임포트:', file);
      // 엑셀 임포트 로직 구현
    }
  };

  const handleExcelExport = () => {
    console.log('엑셀 익스포트');
    // 엑셀 익스포트 로직 구현
  };

  const handleDownloadTemplate = () => {
    console.log('예시 파일 다운로드');
    // 예시 파일 다운로드 로직 구현
  };

  const handleDownloadUnregistered = () => {
    console.log('미등록 리스트 다운로드');
    // 미등록 리스트 다운로드 로직 구현
  };

  const isAllSelected =
    workHistories.length > 0 && selectedRows.length === workHistories.length;
  const isSomeSelected = selectedRows.length > 0 && selectedRows.length < workHistories.length;

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className='p-4 sm:p-6 md:p-8'>
      <h1 className='text-3xl font-bold mb-6'>업무 이력 작성</h1>

      {/* 필터 및 액션 영역 */}
      <div className="mb-6 space-y-4">
        {/* 필터 토글 및 엑셀 버튼 영역 */}
        <div className="flex flex-wrap items-center gap-2">
          {/* 필터 버튼 */}
          <Button
            variant={isFilterOpen ? "default" : "outline"}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="relative"
          >
            <Filter className="w-4 h-4 mr-2" />
            필터
            {activeFiltersCount > 0 && (
              <Badge 
                variant="secondary" 
                className="ml-2 h-5 min-w-5 rounded-full px-1 text-xs"
              >
                {activeFiltersCount}
              </Badge>
            )}
            <ChevronDown
              className={cn(
                "w-4 h-4 ml-2 transition-transform",
                isFilterOpen && "rotate-180"
              )}
            />
          </Button>

          {/* 구분선 */}
          <div className="h-8 w-px bg-border" />

          {/* 엑셀 관련 버튼들 */}
          <div className="relative">
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleExcelImport}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              id="excel-import"
            />
            <Button variant="outline" asChild>
              <label htmlFor="excel-import" className="cursor-pointer">
                <FileUp className="w-4 h-4 mr-2" />
                엑셀 임포트
              </label>
            </Button>
          </div>

          <Button variant="outline" onClick={handleExcelExport}>
            <FileDown className="w-4 h-4 mr-2" />
            엑셀 익스포트
          </Button>

          <Button variant="outline" onClick={handleDownloadTemplate}>
            <Download className="w-4 h-4 mr-2" />
            예시 파일 다운로드
          </Button>

          <Button variant="outline" onClick={handleDownloadUnregistered}>
            <Download className="w-4 h-4 mr-2" />
            미등록 리스트 다운로드
          </Button>
        </div>

        {/* 필터 상세 영역 - Collapsible */}
        <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <CollapsibleContent>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* 필터 헤더 */}
                  <div className="flex items-center justify-between pb-2 border-b">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold">상세 검색 조건</h3>
                      {activeFiltersCount > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {activeFiltersCount}개 필터 적용 중
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleResetFilters}
                      disabled={activeFiltersCount === 0}
                      className="h-8 text-xs"
                    >
                      <X className="w-3 h-3 mr-1" />
                      초기화
                    </Button>
                  </div>

                  {/* 필터 입력 필드들 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* 시작 날짜 */}
                    <div className="space-y-2">
                      <Label htmlFor="start-date" className="text-sm font-medium">
                        시작날짜
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="start-date"
                            variant="outline"
                            className={cn(
                              'w-full justify-start text-left font-normal',
                              !startDate && 'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? dayjs(startDate).format('YYYY-MM-DD') : '날짜 선택'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={setStartDate}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* 종료 날짜 */}
                    <div className="space-y-2">
                      <Label htmlFor="end-date" className="text-sm font-medium">
                        종료날짜
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="end-date"
                            variant="outline"
                            className={cn(
                              'w-full justify-start text-left font-normal',
                              !endDate && 'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? dayjs(endDate).format('YYYY-MM-DD') : '날짜 선택'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={setEndDate}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* 이름 */}
                    <div className="space-y-2">
                      <Label htmlFor="filter-name" className="text-sm font-medium">
                        이름
                      </Label>
                      <Input
                        id="filter-name"
                        placeholder="담당자 이름 입력"
                        value={filterName}
                        onChange={(e) => setFilterName(e.target.value)}
                      />
                    </div>

                    {/* 정렬 */}
                    <div className="space-y-2">
                      <Label htmlFor="sort-order" className="text-sm font-medium">
                        정렬
                      </Label>
                      <Select value={sortOrder} onValueChange={setSortOrder}>
                        <SelectTrigger id="sort-order">
                          <SelectValue placeholder="정렬 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="latest">최신순</SelectItem>
                          <SelectItem value="oldest">오래된순</SelectItem>
                          <SelectItem value="name-asc">이름순 (가-하)</SelectItem>
                          <SelectItem value="name-desc">이름순 (하-가)</SelectItem>
                          <SelectItem value="hours-desc">소요시간 많은순</SelectItem>
                          <SelectItem value="hours-asc">소요시간 적은순</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* 조회 버튼 */}
                  <div className="flex justify-end pt-2">
                    <Button onClick={handleSearch} className="min-w-32">
                      <Search className="w-4 h-4 mr-2" />
                      조회
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* 테이블 카드 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>업무 이력 테이블</CardTitle>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleDuplicateSelected}
                disabled={selectedRows.length === 0}
              >
                <Copy className="w-4 h-4 mr-2" />
                복제 ({selectedRows.length})
              </Button>
              <Button size="sm" onClick={handleAddRow}>
                <Plus className="w-4 h-4 mr-2" />
                추가
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isWorkHistoriesLoading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">로딩 중...</p>
            </div>
          ) : workHistories && workHistories.length > 0 ? (
            <div className="overflow-x-auto">
              <Table className="min-w-[1500px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox
                        checked={isAllSelected}
                        onCheckedChange={handleSelectAll}
                        aria-label="Select all"
                        className={cn(isSomeSelected && 'data-[state=checked]:bg-muted')}
                      />
                    </TableHead>
                    <TableHead className="w-[60px]">No</TableHead>
                    <TableHead className="min-w-[140px]">일자</TableHead>
                    <TableHead className="min-w-[120px]">담당자</TableHead>
                    <TableHead className="min-w-[120px]">업무 분류</TableHead>
                    <TableHead className="min-w-[120px]">업무 파트</TableHead>
                    <TableHead className="min-w-[120px]">업무 구분</TableHead>
                    <TableHead className="min-w-[100px]">소요시간</TableHead>
                    <TableHead className="min-w-[300px]">내용</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workHistories.map((row: WorkHistory) => (
                    <TableRow key={row.no} className="hover:bg-muted/50">
                      {/* 체크박스 */}
                      <TableCell>
                        <Checkbox
                          checked={selectedRows.includes(row.no)}
                          onCheckedChange={(checked) =>
                            handleSelectRow(row.no, checked as boolean)
                          }
                          aria-label={`Select row ${row.no}`}
                        />
                      </TableCell>

                      {/* No */}
                      <TableCell className="font-medium">{row.no}</TableCell>

                      {/* 일자 */}
                      <TableCell>
                        {editingRow === row.no ? (
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  'w-full justify-start text-left font-normal',
                                  !editData?.date && 'text-muted-foreground'
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {editData?.date
                                  ? dayjs(editData.date).format('YYYY-MM-DD')
                                  : '날짜 선택'}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={editData?.date ? new Date(editData.date) : undefined}
                                onSelect={(date) =>
                                  updateEditData('date', date ? dayjs(date).format('YYYY-MM-DD') : '')
                                }
                              />
                            </PopoverContent>
                          </Popover>
                        ) : (
                          <span className="text-sm">{dayjs(row.date).format('YYYY-MM-DD')}</span>
                        )}
                      </TableCell>

                      {/* 담당자 */}
                      <TableCell>
                        {editingRow === row.no ? (
                          <Input
                            value={editData?.manager_name || ''}
                            disabled
                            className="bg-muted cursor-not-allowed"
                            placeholder="담당자"
                          />
                        ) : (
                          <span className="text-sm">{row.manager_name}</span>
                        )}
                      </TableCell>

                      {/* 업무 분류 */}
                      <TableCell>
                        {editingRow === row.no ? (
                          <Select
                            value={editData?.work_group?.work_code || undefined}
                            onValueChange={(value) => {
                              console.log('업무 분류 선택:', value);
                              console.log('workGroups:', workGroups);
                              // 업무 분류 선택 시 전체 객체 저장
                              const selectedGroup = workGroups?.find((g) => g.work_code === value);
                              console.log('selectedGroup:', selectedGroup);
                              if (selectedGroup) {
                                // 한 번에 여러 필드 업데이트
                                setEditData((prev) => prev ? {
                                  ...prev,
                                  work_group: selectedGroup,
                                  work_part: undefined // 업무 분류 변경 시 업무 파트 초기화
                                } : null);
                                setSelectedCategorySeq(selectedGroup.work_code_seq);
                              } else {
                                console.error('선택한 업무 분류를 찾을 수 없습니다:', value);
                              }
                            }}
                            disabled={isWorkGroupsLoading}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={isWorkGroupsLoading ? "로딩 중..." : "업무 분류"} />
                            </SelectTrigger>
                            <SelectContent>
                              {workGroups?.map((group) => (
                                <SelectItem key={group.work_code} value={group.work_code}>
                                  {group.work_code_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge variant="outline">{row.work_group?.work_code_name}</Badge>
                        )}
                      </TableCell>

                      {/* 업무 파트 */}
                      <TableCell>
                        {editingRow === row.no ? (
                          <Select
                            value={editData?.work_part?.work_code || undefined}
                            onValueChange={(value) => {
                              console.log('업무 파트 선택:', value);
                              console.log('workPartOptions:', workPartOptions);
                              const selectedPart = workPartOptions?.find((p) => p.work_code === value);
                              console.log('selectedPart:', selectedPart);
                              if (selectedPart) {
                                updateEditData('work_part', selectedPart);
                              } else {
                                console.error('선택한 업무 파트를 찾을 수 없습니다:', value);
                              }
                            }}
                            disabled={isWorkPartOptionsLoading || !workPartOptions || workPartOptions.length === 0}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={
                                isWorkPartOptionsLoading
                                  ? "로딩 중..."
                                  : (!workPartOptions || workPartOptions.length === 0)
                                    ? "업무 분류를 먼저 선택하세요"
                                    : "업무 파트"
                              } />
                            </SelectTrigger>
                            <SelectContent>
                              {workPartOptions?.map((part) => (
                                <SelectItem key={part.work_code} value={part.work_code}>
                                  {part.work_code_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge variant="outline">{row.work_part?.work_code_name}</Badge>
                        )}
                      </TableCell>

                      {/* 업무 구분 */}
                      <TableCell>
                        {editingRow === row.no ? (
                          <Select
                            value={editData?.work_division?.work_code || undefined}
                            onValueChange={(value) => {
                              console.log('업무 구분 선택:', value);
                              console.log('workDivision:', workDivision);
                              const selectedDivision = workDivision?.find((d) => d.work_code === value);
                              console.log('selectedDivision:', selectedDivision);
                              if (selectedDivision) {
                                updateEditData('work_division', selectedDivision);
                              } else {
                                console.error('선택한 업무 구분을 찾을 수 없습니다:', value);
                              }
                            }}
                            disabled={isWorkDivisionLoading}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={isWorkDivisionLoading ? "로딩 중..." : "업무 구분"} />
                            </SelectTrigger>
                            <SelectContent>
                              {workDivision?.map((division) => (
                                <SelectItem key={division.work_code} value={division.work_code}>
                                  {division.work_code_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge variant="secondary">{row.work_division?.work_code_name}</Badge>
                        )}
                      </TableCell>

                      {/* 소요시간 */}
                      <TableCell>
                        {editingRow === row.no ? (
                          <Input
                            type="number"
                            min="0"
                            max="24"
                            value={editData?.hours}
                            onChange={(e) =>
                              updateEditData('hours', parseInt(e.target.value) || 0)
                            }
                            className="w-full"
                          />
                        ) : (
                          <span className="font-medium">{row.hours}h</span>
                        )}
                      </TableCell>

                      {/* 내용 */}
                      <TableCell>
                        {editingRow === row.no ? (
                          <Textarea
                            value={editData?.content}
                            onChange={(e) => updateEditData('content', e.target.value)}
                            className="min-h-[80px] w-full resize-y"
                            placeholder="업무 내용을 입력하세요"
                          />
                        ) : (
                          <p className="text-sm line-clamp-2 text-muted-foreground">
                            {row.content}
                          </p>
                        )}
                      </TableCell>

                      {/* 액션 */}
                      <TableCell>
                        {editingRow === row.no ? (
                          <div className="flex gap-2">
                            <Button size="sm" onClick={handleSave}>
                              저장
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleCancel}
                            >
                              취소
                            </Button>
                          </div>
                        ) : (
                          <div className="flex justify-end">
                            <DropdownMenu modal={false}>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 data-[state=open]:bg-muted"
                                >
                                  <EllipsisVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-32">
                                <DropdownMenuItem onClick={() => handleDuplicate(row)}>
                                  <Copy className="h-4 w-4 mr-2" />
                                  <span>복제</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEdit(row)}>
                                  <Pencil className="h-4 w-4 mr-2" />
                                  <span>수정</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleDelete(row)}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  <span>삭제</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <Empty description="등록된 업무 이력이 없습니다" />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
