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
import { useState } from 'react';

interface WorkHistory {
  no: number;
  date: string;
  manager: string;
  category: string;
  part: string;
  type: string;
  hours: number;
  content: string;
}

// 목업 데이터
const mockManagers = ['김철수', '이영희', '박민수', '최지영', '정대현'];
const mockCategories = ['개발', '기획', '디자인', '마케팅', '운영'];
const mockParts = ['프론트엔드', '백엔드', 'UI/UX', '콘텐츠', '고객지원'];
const mockTypes = ['신규 개발', '유지보수', '버그 수정', '기능 개선', '문서 작성'];

export default function Report() {
  const [workHistories, setWorkHistories] = useState<WorkHistory[]>([
    {
      no: 1,
      date: '2025-11-01',
      manager: '김철수',
      category: '개발',
      part: '프론트엔드',
      type: '신규 개발',
      hours: 8,
      content: '사용자 관리 페이지 UI 구현 및 API 연동 작업',
    },
    {
      no: 2,
      date: '2025-11-02',
      manager: '이영희',
      category: '기획',
      part: 'UI/UX',
      type: '기능 개선',
      hours: 4,
      content: '대시보드 레이아웃 개선 및 사용자 피드백 반영',
    },
    {
      no: 3,
      date: '2025-11-03',
      manager: '박민수',
      category: '개발',
      part: '백엔드',
      type: '버그 수정',
      hours: 6,
      content: '데이터베이스 쿼리 최적화 및 성능 이슈 해결',
    },
  ]);

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
    const newRow: WorkHistory = {
      no: workHistories.length + 1,
      date: dayjs().format('YYYY-MM-DD'),
      manager: '',
      category: '',
      part: '',
      type: '',
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

  const handleSave = () => {
    if (editData) {
      setWorkHistories(
        workHistories.map((item) => (item.no === editData.no ? editData : item))
      );
      setEditingRow(null);
      setEditData(null);
    }
  };

  const handleCancel = () => {
    setEditingRow(null);
    setEditData(null);
  };

  const handleDuplicate = (row: WorkHistory) => {
    const maxNo = Math.max(...workHistories.map((item) => item.no));
    const newRow: WorkHistory = {
      ...row,
      no: maxNo + 1,
    };
    setWorkHistories([...workHistories, newRow]);
  };

  const handleDuplicateSelected = () => {
    if (selectedRows.length === 0) return;

    const selectedWorkHistories = workHistories.filter((row) =>
      selectedRows.includes(row.no)
    );

    let maxNo = Math.max(...workHistories.map((item) => item.no));
    const duplicatedRows = selectedWorkHistories.map((row) => ({
      ...row,
      no: ++maxNo,
    }));

    setWorkHistories([...workHistories, ...duplicatedRows]);
    setSelectedRows([]);
  };

  const handleDelete = (no: number) => {
    setWorkHistories(workHistories.filter((item) => item.no !== no));
    setSelectedRows(selectedRows.filter((rowNo) => rowNo !== no));
  };

  const updateEditData = (field: keyof WorkHistory, value: any) => {
    if (editData) {
      setEditData({ ...editData, [field]: value });
    }
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
                            initialFocus
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
                            initialFocus
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
          {workHistories && workHistories.length > 0 ? (
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
                                initialFocus
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
                          <Select
                            value={editData?.manager}
                            onValueChange={(value) => updateEditData('manager', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="담당자 선택" />
                            </SelectTrigger>
                            <SelectContent>
                              {mockManagers.map((manager) => (
                                <SelectItem key={manager} value={manager}>
                                  {manager}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <span className="text-sm">{row.manager}</span>
                        )}
                      </TableCell>

                      {/* 업무 분류 */}
                      <TableCell>
                        {editingRow === row.no ? (
                          <Select
                            value={editData?.category}
                            onValueChange={(value) => updateEditData('category', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="분류 선택" />
                            </SelectTrigger>
                            <SelectContent>
                              {mockCategories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge variant="outline">{row.category}</Badge>
                        )}
                      </TableCell>

                      {/* 업무 파트 */}
                      <TableCell>
                        {editingRow === row.no ? (
                          <Select
                            value={editData?.part}
                            onValueChange={(value) => updateEditData('part', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="파트 선택" />
                            </SelectTrigger>
                            <SelectContent>
                              {mockParts.map((part) => (
                                <SelectItem key={part} value={part}>
                                  {part}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge variant="outline">{row.part}</Badge>
                        )}
                      </TableCell>

                      {/* 업무 구분 */}
                      <TableCell>
                        {editingRow === row.no ? (
                          <Select
                            value={editData?.type}
                            onValueChange={(value) => updateEditData('type', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="구분 선택" />
                            </SelectTrigger>
                            <SelectContent>
                              {mockTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge variant="secondary">{row.type}</Badge>
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
                            className="min-h-[80px] w-full resize-none"
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
                                  onClick={() => handleDelete(row.no)}
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
