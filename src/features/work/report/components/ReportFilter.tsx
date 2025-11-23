import { Badge } from '@/components/shadcn/badge';
import { Button } from '@/components/shadcn/button';
import { Calendar } from '@/components/shadcn/calendar';
import { Card, CardContent } from '@/components/shadcn/card';
import {
  Collapsible,
  CollapsibleContent
} from '@/components/shadcn/collapsible';
import { Label } from '@/components/shadcn/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/shadcn/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/select';
import { GetUsersResp } from '@/lib/api/user'; // Added import
import { WorkCodeResp, WorkGroupWithParts } from '@/lib/api/work';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import {
  CalendarIcon,
  Search,
  X
} from 'lucide-react';



import { useReportContext } from '@/features/work/report/contexts/ReportContext';

interface ReportFilterProps {
  workGroups: WorkGroupWithParts[];
  workDivision: WorkCodeResp[];
  users: GetUsersResp[];
}

const ReportFilter = ({
  workGroups,
  workDivision,
  users,
}: ReportFilterProps) => {
  const {
    isFilterOpen,
    setIsFilterOpen,
    activeFiltersCount,
    handleResetFilters,
    filters,
    handleFilterChange: onFilterChange,
    handleSearch,
  } = useReportContext();
  // 선택된 업무 분류에 따른 업무 파트 목록
  const currentWorkParts = filters.selectedWorkGroup !== 'all'
    ? workGroups.find(g => g.work_code === filters.selectedWorkGroup)?.parts || []
    : [];

  return (
    <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen}>
      <CollapsibleContent>
        <Card className="shadow-sm bg-muted/10">
          <CardContent className="pt-6 pb-6">
            <div className="space-y-6">
              {/* 필터 헤더 */}
              <div className="flex items-center justify-between pb-2 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-foreground/80">상세 검색 조건</h3>
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="text-xs font-normal">
                      {activeFiltersCount}개 필터 적용 중
                    </Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResetFilters}
                  disabled={activeFiltersCount === 0}
                  className="h-8 text-xs hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <X className="w-3 h-3 mr-1" />
                  초기화
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4 items-end">
                {/* 시작 날짜 */}
                <div className="space-y-2">
                  <Label htmlFor="start-date" className="text-xs text-muted-foreground">
                    시작날짜
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="start-date"
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal h-9 px-3',
                          !filters.startDate && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                        {filters.startDate ? dayjs(filters.startDate).format('YYYY-MM-DD') : <span className="text-xs">날짜 선택</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={filters.startDate}
                        onSelect={(date) => onFilterChange('startDate', date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* 종료 날짜 */}
                <div className="space-y-2">
                  <Label htmlFor="end-date" className="text-xs text-muted-foreground">
                    종료날짜
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="end-date"
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal h-9 px-3',
                          !filters.endDate && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                        {filters.endDate ? dayjs(filters.endDate).format('YYYY-MM-DD') : <span className="text-xs">날짜 선택</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={filters.endDate}
                        onSelect={(date) => onFilterChange('endDate', date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* 담당자 */}
        <div className="space-y-2">
          <Label htmlFor="manager" className="text-xs text-muted-foreground">담당자</Label>
          <Select 
            value={filters.filterName || 'all'} 
            onValueChange={(value) => onFilterChange('filterName', value === 'all' ? '' : value)}
          >
            <SelectTrigger id="manager" className="h-9">
              <SelectValue placeholder="전체" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              {users.map((user) => (
                <SelectItem key={user.user_id} value={user.user_id}>
                  {user.user_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

                {/* 업무 분류 */}
                <div className="space-y-2">
                  <Label htmlFor="work-group" className="text-xs text-muted-foreground">
                    업무 분류
                  </Label>
                  <Select 
                    value={filters.selectedWorkGroup} 
                    onValueChange={(value) => {
                      onFilterChange('selectedWorkGroup', value);
                      onFilterChange('selectedWorkPart', 'all'); // 분류 변경 시 파트 초기화
                    }}
                  >
                    <SelectTrigger id="work-group" className="h-9">
                      <SelectValue placeholder="전체" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      {workGroups.map((group) => (
                        <SelectItem key={group.work_code} value={group.work_code}>
                          {group.work_code_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 업무 파트 */}
                <div className="space-y-2">
                  <Label htmlFor="work-part" className="text-xs text-muted-foreground">
                    업무 파트
                  </Label>
                  <Select 
                    value={filters.selectedWorkPart} 
                    onValueChange={(value) => onFilterChange('selectedWorkPart', value)}
                    disabled={filters.selectedWorkGroup === 'all'}
                  >
                    <SelectTrigger id="work-part" className="h-9">
                      <SelectValue placeholder={filters.selectedWorkGroup === 'all' ? "-" : "전체"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      {currentWorkParts.map((part) => (
                        <SelectItem key={part.work_code} value={part.work_code}>
                          {part.work_code_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 업무 구분 */}
                <div className="space-y-2">
                  <Label htmlFor="work-division" className="text-xs text-muted-foreground">
                    업무 구분
                  </Label>
                  <Select value={filters.selectedWorkDivision} onValueChange={(value) => onFilterChange('selectedWorkDivision', value)}>
                    <SelectTrigger id="work-division" className="h-9">
                      <SelectValue placeholder="전체" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      {workDivision.map((division) => (
                        <SelectItem key={division.work_code} value={division.work_code}>
                          {division.work_code_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 정렬 */}
                <div className="space-y-2">
                  <Label htmlFor="sort-order" className="text-xs text-muted-foreground">
                    정렬 기준
                  </Label>
                  <Select value={filters.sortOrder} onValueChange={(value) => onFilterChange('sortOrder', value)}>
                    <SelectTrigger id="sort-order" className="h-9">
                      <SelectValue placeholder="정렬 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="latest">최신순</SelectItem>
                      <SelectItem value="oldest">오래된순</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 조회 버튼 */}
                <div className="flex items-end">
                  <Button onClick={handleSearch} className="w-full h-9">
                    <Search className="w-4 h-4 mr-2" />
                    조회
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
}

export default ReportFilter;
