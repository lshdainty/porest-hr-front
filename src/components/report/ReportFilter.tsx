import { Badge } from '@/components/shadcn/badge';
import { Button } from '@/components/shadcn/button';
import { Calendar } from '@/components/shadcn/calendar';
import { Card, CardContent } from '@/components/shadcn/card';
import {
  Collapsible,
  CollapsibleContent
} from '@/components/shadcn/collapsible';
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
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import {
  CalendarIcon,
  Search,
  X
} from 'lucide-react';

interface ReportFilterProps {
  isFilterOpen: boolean;
  setIsFilterOpen: (open: boolean) => void;
  activeFiltersCount: number;
  handleResetFilters: () => void;
  startDate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;
  endDate: Date | undefined;
  setEndDate: (date: Date | undefined) => void;
  filterName: string;
  setFilterName: (name: string) => void;
  sortOrder: string;
  setSortOrder: (order: string) => void;
  handleSearch: () => void;
}

export default function ReportFilter({
  isFilterOpen,
  setIsFilterOpen,
  activeFiltersCount,
  handleResetFilters,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  filterName,
  setFilterName,
  sortOrder,
  setSortOrder,
  handleSearch,
}: ReportFilterProps) {
  return (
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
  );
}
