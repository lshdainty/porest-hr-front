import { Badge } from '@/components/shadcn/badge';
import { Button } from '@/components/shadcn/button';
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
import { InputDatePicker } from '@/components/shadcn/inputDatePicker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shadcn/table';
import { Textarea } from '@/components/shadcn/textarea';
import { EmptyReport } from '@/features/work/report/components/EmptyReport';
import { WorkCodeResp, WorkGroupWithParts } from '@/lib/api/work';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import {
  Copy,
  EllipsisVertical,
  Pencil,
  Plus,
  Trash2
} from 'lucide-react';

import { usePermission } from '@/contexts/PermissionContext';
import { useReportContext } from '@/features/work/report/contexts/ReportContext';
import { WorkHistory } from '@/features/work/report/types';
import { Activity } from 'react';
import { useTranslation } from 'react-i18next';

interface ReportTableProps {
  workHistories: WorkHistory[];
  isWorkHistoriesLoading: boolean;
  handleAddRow: () => void;
  handleDuplicateSelected: () => void;
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

const ReportTable = ({
  workHistories,
  isWorkHistoriesLoading,
  handleAddRow,
  handleDuplicateSelected,
  handleSave,
  handleCancel,
  handleEdit,
  handleDelete,
  handleDuplicate,
  workGroups,
  isWorkGroupsLoading,
  workDivision,
  isWorkDivisionLoading,
}: ReportTableProps) => {
  const { t } = useTranslation('work');
  const { t: tc } = useTranslation('common');
  const {
    selectedRows,
    setSelectedRows,
    editingRow,
    editData,
    setEditData,
    updateEditData,
  } = useReportContext();

  const { hasAnyPermission } = usePermission();

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
  const isAllSelected =
    workHistories.length > 0 && selectedRows.length === workHistories.length;
  const isSomeSelected = selectedRows.length > 0 && selectedRows.length < workHistories.length;

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle>{t('report.tableTitle')}</CardTitle>
          <Activity mode={hasAnyPermission(['WORK:WRITE', 'WORK:MANAGE']) ? 'visible' : 'hidden'}>
            <div className='flex gap-2'>
              <Button
                size='sm'
                variant='outline'
                onClick={handleDuplicateSelected}
                disabled={selectedRows.length === 0}
              >
                <Copy className='w-4 h-4 mr-2' />
                {t('report.duplicate')} ({selectedRows.length})
              </Button>
              <Button size='sm' onClick={handleAddRow}>
                <Plus className='w-4 h-4 mr-2' />
                {t('report.add')}
              </Button>
            </div>
          </Activity>
        </div>
      </CardHeader>
      <CardContent>
        {isWorkHistoriesLoading ? (
          <div className='flex items-center justify-center py-8'>
            <p className='text-muted-foreground'>{t('report.loading')}</p>
          </div>
        ) : workHistories && workHistories.length > 0 ? (
          <div className='overflow-x-auto'>
            <Table className='min-w-[1500px]'>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[50px]'>
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={handleSelectAll}
                      aria-label='Select all'
                      className={cn(isSomeSelected && 'data-[state=checked]:bg-muted')}
                    />
                  </TableHead>
                  <TableHead className='w-[60px]'>No</TableHead>
                  <TableHead className='min-w-[140px]'>{t('report.fieldDate')}</TableHead>
                  <TableHead className='min-w-[120px]'>{t('report.manager')}</TableHead>
                  <TableHead className='min-w-[120px]'>{t('report.fieldWorkGroup')}</TableHead>
                  <TableHead className='min-w-[120px]'>{t('report.fieldWorkPart')}</TableHead>
                  <TableHead className='min-w-[120px]'>{t('report.fieldWorkDivision')}</TableHead>
                  <TableHead className='min-w-[100px]'>{t('report.hours')}</TableHead>
                  <TableHead className='min-w-[300px]'>{t('report.content')}</TableHead>
                  <TableHead className='w-[80px]'></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workHistories.map((row: WorkHistory) => (
                  <TableRow key={row.no} className='hover:bg-muted/50'>
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
                    <TableCell className='font-medium'>{row.no}</TableCell>

                    {/* 일자 */}
                    <TableCell>
                      {editingRow === row.no ? (
                        <InputDatePicker
                          value={editData?.date || ''}
                          onValueChange={(value) => updateEditData('date', value)}
                          placeholder={t('report.selectDate')}
                        />
                      ) : (
                        <span className='text-sm'>{dayjs(row.date).format('YYYY-MM-DD')}</span>
                      )}
                    </TableCell>

                    {/* 담당자 */}
                    <TableCell>
                      {editingRow === row.no ? (
                        <Input
                          value={editData?.manager_name || ''}
                          disabled
                          className='bg-muted cursor-not-allowed'
                          placeholder={t('report.manager')}
                        />
                      ) : (
                        <span className='text-sm'>{row.manager_name}</span>
                      )}
                    </TableCell>

                    {/* 업무 분류 */}
                    <TableCell>
                      {editingRow === row.no ? (
                        <Select
                          value={editData?.work_group?.work_code || ''}
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
                            <SelectValue placeholder={isWorkGroupsLoading ? t('report.loading') : t('report.fieldWorkGroup')} />
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
                        <Badge variant='outline'>{row.work_group?.work_code_name}</Badge>
                      )}
                    </TableCell>

                    {/* 업무 파트 */}
                    <TableCell>
                      {editingRow === row.no ? (
                        <Select
                          value={editData?.work_part?.work_code || ''}
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
                                ? t('report.selectGroupFirst')
                                : t('report.fieldWorkPart')
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
                        <Badge variant='outline'>{row.work_part?.work_code_name}</Badge>
                      )}
                    </TableCell>

                    {/* 업무 구분 */}
                    <TableCell>
                      {editingRow === row.no ? (
                        <Select
                          value={editData?.work_division?.work_code || ''}
                          onValueChange={(value) => {
                            const selectedDivision = workDivision?.find((d) => d.work_code === value);
                            if (selectedDivision) {
                              updateEditData('work_division', selectedDivision);
                            }
                          }}
                          disabled={isWorkDivisionLoading}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={isWorkDivisionLoading ? t('report.loading') : t('report.fieldWorkDivision')} />
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
                        <Badge variant='secondary'>{row.work_division?.work_code_name}</Badge>
                      )}
                    </TableCell>

                    {/* 소요시간 */}
                    <TableCell>
                      {editingRow === row.no ? (
                        <Input
                          type='number'
                          min='0'
                          max='24'
                          value={editData?.hours}
                          onChange={(e) => {
                            const value = e.target.value;
                            updateEditData('hours', value === '' ? '' : parseInt(value) || 0);
                          }}
                          className='w-full'
                        />
                      ) : (
                        <span className='font-medium'>{row.hours}h</span>
                      )}
                    </TableCell>

                    {/* 내용 */}
                    <TableCell>
                      {editingRow === row.no ? (
                        <Textarea
                          value={editData?.content}
                          onChange={(e) => updateEditData('content', e.target.value)}
                          className='min-h-[80px] w-full resize-y'
                          placeholder={t('report.contentPlaceholder')}
                        />
                      ) : (
                        <p className='text-sm line-clamp-2 text-muted-foreground'>
                          {row.content}
                        </p>
                      )}
                    </TableCell>

                    {/* 액션 */}
                    <TableCell>
                      {editingRow === row.no ? (
                        <div className='flex gap-2'>
                          <Button size='sm' onClick={handleSave}>
                            {tc('save')}
                          </Button>
                          <Button
                            size='sm'
                            variant='outline'
                            onClick={handleCancel}
                          >
                            {tc('cancel')}
                          </Button>
                        </div>
                      ) : (
                        <div className='flex justify-end'>
                          <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant='ghost'
                                size='sm'
                                className='h-8 w-8 p-0 data-[state=open]:bg-muted'
                              >
                                <EllipsisVertical className='w-4 h-4' />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end' className='w-32'>
                              <DropdownMenuItem onClick={() => handleDuplicate(row)}>
                                <Copy className='h-4 w-4 mr-2' />
                                <span>{t('report.duplicate')}</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEdit(row)}>
                                <Pencil className='h-4 w-4 mr-2' />
                                <span>{tc('edit')}</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDelete(row)}
                                className='text-destructive focus:text-destructive'
                              >
                                <Trash2 className='h-4 w-4 mr-2' />
                                <span>{tc('delete')}</span>
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
          <EmptyReport onAddClick={handleAddRow} />
        )}
      </CardContent>
    </Card>
  );
}

export { ReportTable }
