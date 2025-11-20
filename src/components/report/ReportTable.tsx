import { Badge } from '@/components/shadcn/badge';
import { Button } from '@/components/shadcn/button';
import { Calendar } from '@/components/shadcn/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card';
import { Checkbox } from '@/components/shadcn/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/shadcn/dropdownMenu';
import { Input } from '@/components/shadcn/input';
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
import { WorkCodeResp, WorkGroupWithParts } from '@/lib/api/work';
import { cn } from '@/lib/utils';
import { Empty } from 'antd';
import dayjs from 'dayjs';
import {
  CalendarIcon,
  Copy,
  EllipsisVertical,
  Pencil,
  Plus,
  Trash2
} from 'lucide-react';

export interface WorkHistory {
  no: number;
  work_history_seq?: number;
  date: string;
  manager_id: string;
  manager_name: string;
  work_group?: WorkCodeResp;
  work_part?: WorkCodeResp;
  work_division?: WorkCodeResp;
  hours: number | string;
  content: string;
}

interface ReportTableProps {
  workHistories: WorkHistory[];
  isWorkHistoriesLoading: boolean;
  selectedRows: number[];
  handleSelectAll: (checked: boolean) => void;
  handleSelectRow: (no: number, checked: boolean) => void;
  handleAddRow: () => void;
  handleDuplicateSelected: () => void;
  editingRow: number | null;
  editData: WorkHistory | null;
  setEditData: React.Dispatch<React.SetStateAction<WorkHistory | null>>;
  updateEditData: (field: keyof WorkHistory, value: any) => void;
  handleSave: () => void;
  handleCancel: () => void;
  handleEdit: (row: WorkHistory) => void;
  handleDelete: (row: WorkHistory) => void;
  handleDuplicate: (row: WorkHistory) => void;
  workGroups: WorkGroupWithParts[];
  isWorkGroupsLoading: boolean;
  workDivision: WorkCodeResp[] | undefined;
  isWorkDivisionLoading: boolean;
}

export default function ReportTable({
  workHistories,
  isWorkHistoriesLoading,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  handleAddRow,
  handleDuplicateSelected,
  editingRow,
  editData,
  setEditData,
  updateEditData,
  handleSave,
  handleCancel,
  handleEdit,
  handleDelete,
  handleDuplicate,
  workGroups,
  isWorkGroupsLoading,
  workDivision,
  isWorkDivisionLoading,
}: ReportTableProps) {
  const isAllSelected =
    workHistories.length > 0 && selectedRows.length === workHistories.length;
  const isSomeSelected = selectedRows.length > 0 && selectedRows.length < workHistories.length;

  return (
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
                          value={editData?.work_group?.work_code || ""}
                          onValueChange={(value) => {
                            const selectedGroup = workGroups?.find((g) => g.work_code === value);
                            if (selectedGroup) {
                              setEditData((prev) => prev ? {
                                ...prev,
                                work_group: selectedGroup,
                                work_part: undefined // 업무 분류 변경 시 업무 파트 초기화
                              } : null);
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
                          value={editData?.work_part?.work_code || ""}
                          onValueChange={(value) => {
                            const currentGroup = workGroups.find(g => g.work_code === editData?.work_group?.work_code);
                            const selectedPart = currentGroup?.parts.find((p) => p.work_code === value);
                            if (selectedPart) {
                              updateEditData('work_part', selectedPart);
                            }
                          }}
                          disabled={!editData?.work_group}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={
                              !editData?.work_group
                                ? "업무 분류를 먼저 선택하세요"
                                : "업무 파트"
                            } />
                          </SelectTrigger>
                          <SelectContent>
                            {workGroups.find(g => g.work_code === editData?.work_group?.work_code)?.parts.map((part) => (
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
                          value={editData?.work_division?.work_code || ""}
                          onValueChange={(value) => {
                            const selectedDivision = workDivision?.find((d) => d.work_code === value);
                            if (selectedDivision) {
                              updateEditData('work_division', selectedDivision);
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
                          onChange={(e) => {
                            const value = e.target.value;
                            updateEditData('hours', value === '' ? '' : parseInt(value) || 0);
                          }}
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
  );
}
