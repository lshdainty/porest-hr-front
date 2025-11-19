import { useEffect, useState } from 'react';
import { usePostDuesMutation, usePutDuesMutation, useDeleteDuesMutation } from '@/hooks/queries/useDues';
import { GetYearDuesResp } from '@/lib/api/dues';
import { Badge } from '@/components/shadcn/badge';
import { Input } from '@/components/shadcn/input';
import { Button } from '@/components/shadcn/button';
import { InputDatePicker } from '@/components/shadcn/inputDatePicker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shadcn/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/shadcn/dropdownMenu';
import { EllipsisVertical, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Pencil, Copy, Trash2, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';

type EditableDuesData = GetYearDuesResp & { id: string; isNew?: boolean; tempId?: string };
type UpdateDuesData = GetYearDuesResp & { id: string };

interface ModifiedData {
  created: EditableDuesData[];
  updated: UpdateDuesData[];
  deleted: number[];
}

interface DuesTableProps {
  yearDues?: GetYearDuesResp[];
}

export default function DuesTable({ yearDues = [] }: DuesTableProps) {
  const { mutate: postDues } = usePostDuesMutation();
  const { mutate: putDues } = usePutDuesMutation();
  const { mutate: deleteDues } = useDeleteDuesMutation();
  const [tableData, setTableData] = useState<EditableDuesData[]>([]);
  const [modifiedData, setModifiedData] = useState<ModifiedData>({
    created: [],
    updated: [],
    deleted: [],
  });
  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  useEffect(() => {
    if (yearDues) {
      const formattedDues = yearDues.map((dues) => ({
        ...dues,
        id: dues.dues_seq.toString(),
      }));
      setTableData(formattedDues);
    }
  }, [yearDues]);

  useEffect(() => {
    const totalPages = Math.ceil(tableData.length / rowsPerPage);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [tableData, currentPage, rowsPerPage]);

  const handleDelete = (id: string) => {
    const rowToDelete = tableData.find(row => row.id === id);
    if (!rowToDelete) return;

    if (rowToDelete.isNew) {
      setModifiedData({
        ...modifiedData,
        created: modifiedData.created.filter((dues) => dues.id !== id),
      });
    } else {
      setModifiedData({
        ...modifiedData,
        updated: modifiedData.updated.filter((dues) => dues.id !== id),
        deleted: [...modifiedData.deleted, parseInt(id)],
      });
    }

    setTableData(tableData.filter((dues) => dues.id !== id));
  };

  const handleCopy = (row: EditableDuesData) => {
    const tempId = `new_${Date.now()}`;
    const newRow: EditableDuesData = {
      ...row,
      id: tempId,
      dues_seq: 0,
      isNew: true,
      tempId: tempId,
    };
    const newTableData = [...tableData, newRow];
    setTableData(newTableData);
    setModifiedData({
      ...modifiedData,
      created: [...modifiedData.created, newRow],
    });
    setEditingRow(tempId);
    setCurrentPage(Math.ceil(newTableData.length / rowsPerPage));
  };

  const handleAdd = () => {
    const tempId = `new_${Date.now()}`;
    const newRow: EditableDuesData = {
      id: tempId,
      dues_seq: 0,
      dues_date: dayjs().format('YYYYMMDD'),
      dues_user_name: '',
      dues_type: 'OPERATION',
      dues_detail: '',
      dues_amount: 0,
      dues_calc: 'PLUS',
      total_dues: 0,
      isNew: true,
      tempId: tempId,
    };

    const newTableData = [...tableData, newRow];
    setTableData(newTableData);
    setModifiedData({
      ...modifiedData,
      created: [...modifiedData.created, newRow],
    });
    setEditingRow(tempId);
    setCurrentPage(Math.ceil(newTableData.length / rowsPerPage));
  };

  const handleEdit = (id: string) => {
    setEditingRow(id);
  };

  const handleSave = () => {
    modifiedData.created.forEach(dues => {
      const { isNew, tempId, id, ...duesData } = dues;
      postDues(duesData);
    });

    modifiedData.updated.forEach(dues => {
      putDues(dues);
    });

    modifiedData.deleted.forEach(dues_seq => {
      deleteDues(dues_seq);
    });

    setModifiedData({ created: [], updated: [], deleted: [] });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, id: string, field: keyof GetYearDuesResp) => {
    const newData = tableData.map((row) => {
      if (row.id === id) {
        return { ...row, [field]: e.target.value };
      }
      return row;
    });
    setTableData(newData);

    const updatedDues = newData.find(dues => dues.id === id);
    if (!updatedDues) return;

    if (updatedDues.isNew) {
      setModifiedData({
        ...modifiedData,
        created: modifiedData.created.map((dues) =>
          dues.id === id ? updatedDues : dues
        ),
      });
    } else if (!modifiedData.updated.find((dues) => dues.id === id)) {
      setModifiedData({
        ...modifiedData,
        updated: [...modifiedData.updated, updatedDues],
      });
    } else {
      setModifiedData({
        ...modifiedData,
        updated: modifiedData.updated.map((dues) =>
          dues.id === id ? updatedDues : dues
        ),
      });
    }
  };

  const handleSelectChange = (value: string, id: string, field: keyof GetYearDuesResp) => {
    const newData = tableData.map((row) => {
      if (row.id === id) {
        return { ...row, [field]: value };
      }
      return row;
    });
    setTableData(newData);

    const updatedDues = newData.find(dues => dues.id === id);
    if (!updatedDues) return;

    if (updatedDues.isNew) {
      setModifiedData({
        ...modifiedData,
        created: modifiedData.created.map((dues) =>
          dues.id === id ? updatedDues : dues
        ),
      });
    } else if (!modifiedData.updated.find((dues) => dues.id === id)) {
      setModifiedData({
        ...modifiedData,
        updated: [...modifiedData.updated, updatedDues],
      });
    } else {
      setModifiedData({
        ...modifiedData,
        updated: modifiedData.updated.map((dues) =>
          dues.id === id ? updatedDues : dues
        ),
      });
    }
  };

  const handleDateChange = (value: string | undefined, id: string) => {
    if (!value) return;
    const formattedDate = dayjs(value).format('YYYYMMDD');
    const newData = tableData.map((row) => {
      if (row.id === id) {
        return { ...row, dues_date: formattedDate };
      }
      return row;
    });
    setTableData(newData);

    const updatedDues = newData.find(dues => dues.id === id);
    if (!updatedDues) return;

    if (updatedDues.isNew) {
      setModifiedData({
        ...modifiedData,
        created: modifiedData.created.map((dues) =>
          dues.id === id ? updatedDues : dues
        ),
      });
    } else if (!modifiedData.updated.find((dues) => dues.id === id)) {
      setModifiedData({
        ...modifiedData,
        updated: [...modifiedData.updated, updatedDues],
      });
    } else {
      setModifiedData({
        ...modifiedData,
        updated: modifiedData.updated.map((dues) =>
          dues.id === id ? updatedDues : dues
        ),
      });
    }
  };

  const totalPages = tableData.length > 0 ? Math.ceil(tableData.length / rowsPerPage) : 1;
  const paginatedData = tableData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <Card className='flex-1'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle>입출금 내역</CardTitle>
          <div className='flex gap-2'>
            <Button className='text-sm h-8' onClick={handleAdd}>추가</Button>
            <Button className='text-sm h-8' variant='outline' onClick={handleSave}>저장</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className='overflow-x-auto'>
          <Table className='min-w-[1000px]'>
            <TableHeader>
              <TableRow>
                <TableHead className='min-w-[140px] pl-4'>날짜</TableHead>
                <TableHead className='min-w-[120px]'>이름</TableHead>
                <TableHead className='min-w-[250px]'>내용</TableHead>
                <TableHead className='min-w-[140px]'>금액</TableHead>
                <TableHead className='min-w-[100px]'>유형</TableHead>
                <TableHead className='min-w-[140px]'>총액</TableHead>
                <TableHead className='min-w-[80px] pr-4'></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((row) => {
                const isEditing = editingRow === row.id;
                return (
                  <TableRow
                    key={row.id}
                    className={cn(
                      'hover:bg-muted/50 hover:text-foreground',
                      'dark:hover:bg-muted/80 dark:hover:text-foreground'
                    )}
                  >
                    <TableCell className='pl-4'>
                      {isEditing ? (
                        <InputDatePicker
                          value={dayjs(row.dues_date).format('YYYY-MM-DD')}
                          onValueChange={(value) => handleDateChange(value, row.id)}
                        />
                      ) : (
                        dayjs(row.dues_date).format('YYYY-MM-DD')
                      )}
                    </TableCell>
                    <TableCell>
                      {isEditing ? (
                        <Input
                          value={row.dues_user_name}
                          onChange={(e) => handleInputChange(e, row.id, 'dues_user_name')}
                        />
                      ) : (
                        row.dues_user_name
                      )}
                    </TableCell>
                    <TableCell>
                      {isEditing ? (
                        <Input
                          value={row.dues_detail}
                          onChange={(e) => handleInputChange(e, row.id, 'dues_detail')}
                        />
                      ) : (
                        <div>
                          <p className='font-medium'>{row.dues_detail}</p>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className={cn(row.dues_calc === 'PLUS' ? 'text-blue-500' : 'text-red-500')}>
                      {isEditing ? (
                        <Input
                          type='number'
                          value={row.dues_amount}
                          onChange={(e) => handleInputChange(e, row.id, 'dues_amount')}
                        />
                      ) : (
                        `${Math.abs(row.dues_amount).toLocaleString('ko-KR')}원`
                      )}
                    </TableCell>
                    <TableCell>
                      {isEditing ? (
                        <Select
                          value={row.dues_calc}
                          onValueChange={(value) => handleSelectChange(value, row.id, 'dues_calc')}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder='유형' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='PLUS'>입금</SelectItem>
                            <SelectItem value='MINUS'>출금</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge className={cn(
                          'text-xs whitespace-nowrap',
                          row.dues_calc === 'PLUS' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-red-100 text-red-800'
                        )}>
                          {row.dues_calc === 'PLUS' ? '입금' : '출금'}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className='font-medium whitespace-nowrap'>
                        {row.total_dues.toLocaleString('ko-KR')}원
                      </span>
                    </TableCell>
                    <TableCell className='pr-4'>
                      <div className='flex justify-end'>
                        <DropdownMenu modal={false}>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant='ghost'
                              size='sm'
                              className='h-8 w-8 p-0 data-[state=open]:bg-muted hover:bg-muted'
                            >
                              <EllipsisVertical className='w-4 h-4' />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end' className='w-32'>
                            {isEditing ? (
                              <DropdownMenuItem onClick={() => setEditingRow(null)}>
                                <Save className='h-4 w-4' />
                                <span>저장</span>
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => handleEdit(row.id)}>
                                <Pencil className='h-4 w-4' />
                                <span>수정</span>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => handleCopy(row)}>
                              <Copy className='h-4 w-4' />
                              <span>복사</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className='text-destructive focus:text-destructive hover:!bg-destructive/20'
                              onClick={() => handleDelete(row.id)}
                            >
                              <Trash2 className='h-4 w-4' />
                              <span>삭제</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        <div className='flex items-center justify-between p-4'>
          <div className='text-sm text-muted-foreground'>
            {tableData.length} row(s)
          </div>
          <div className='flex items-center space-x-6 lg:space-x-8'>
            <div className='flex items-center space-x-2'>
              <p className='text-sm font-medium'>
                Page {currentPage} of {totalPages}
              </p>
            </div>
            <div className='flex items-center space-x-2'>
              <Button
                variant='outline'
                className='h-8 w-8 p-0'
                onClick={() => setCurrentPage(1)}
                disabled={currentPage <= 1}
              >
                <span className='sr-only'>Go to first page</span>
                <ChevronsLeft className='h-4 w-4' />
              </Button>
              <Button
                variant='outline'
                className='h-8 w-8 p-0'
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage <= 1}
              >
                <span className='sr-only'>Go to previous page</span>
                <ChevronLeft className='h-4 w-4' />
              </Button>
              <Button
                variant='outline'
                className='h-8 w-8 p-0'
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
              >
                <span className='sr-only'>Go to next page</span>
                <ChevronRight className='h-4 w-4' />
              </Button>
              <Button
                variant='outline'
                className='h-8 w-8 p-0'
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage >= totalPages}
              >
                <span className='sr-only'>Go to last page</span>
                <ChevronsRight className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}