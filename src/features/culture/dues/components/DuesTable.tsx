import PermissionGuard from '@/components/auth/PermissionGuard';
import { Button } from '@/components/shadcn/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card';
import { toast } from '@/components/shadcn/sonner';
import { useDeleteDuesMutation, usePostDuesMutation, usePutDuesMutation } from '@/hooks/queries/useDues';
import { GetYearDuesResp } from '@/lib/api/dues';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import DuesTableContent, { EditableDuesData } from './DuesTableContent';

interface DuesTableProps {
  yearDues?: GetYearDuesResp[];
}

const DuesTable = ({ yearDues = [] }: DuesTableProps) => {
  const { mutate: postDues } = usePostDuesMutation();
  const { mutate: putDues } = usePutDuesMutation();
  const { mutate: deleteDues } = useDeleteDuesMutation();
  const [tableData, setTableData] = useState<EditableDuesData[]>([]);
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
      // 새로 생성된 행 - 로컬에서만 삭제
      setTableData(tableData.filter((dues) => dues.id !== id));
    } else {
      // 기존 행 - DELETE API 호출
      deleteDues(rowToDelete.dues_seq, {
        onSuccess: () => {
          setTableData(tableData.filter((dues) => dues.id !== id));
        },
        onError: (error) => {
          console.error('회비 삭제 실패:', error);
          toast.error('회비 삭제에 실패했습니다.');
        }
      });
    }
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
    const newTableData = [newRow, ...tableData];
    setTableData(newTableData);
    setEditingRow(tempId);
    setCurrentPage(1);
  };

  const handleAdd = () => {
    const tempId = `new_${Date.now()}`;
    const newRow: EditableDuesData = {
      id: tempId,
      dues_seq: 0,
      dues_date: dayjs().format('YYYY-MM-DD'),
      dues_user_name: '',
      dues_type: 'OPERATION',
      dues_detail: '',
      dues_amount: 0,
      dues_calc: 'PLUS',
      total_dues: 0,
      isNew: true,
      tempId: tempId,
    };

    const newTableData = [newRow, ...tableData];
    setTableData(newTableData);
    setEditingRow(tempId);
    setCurrentPage(1);
  };

  const handleEdit = (id: string) => {
    setEditingRow(id);
  };

  const handleSaveRow = (id: string) => {
    const rowToSave = tableData.find(row => row.id === id);
    if (!rowToSave) return;

    if (rowToSave.isNew) {
      // 새로 생성된 행 - POST 호출
      const { isNew, tempId, id: rowId, dues_seq, total_dues, ...duesData } = rowToSave;
      postDues(duesData, {
        onSuccess: () => {
          setEditingRow(null);
        },
        onError: (error) => {
          console.error('회비 등록 실패:', error);
          toast.error('회비 등록에 실패했습니다.');
        }
      });
    } else {
      // 기존 행 - PUT 호출
      const { id: rowId, total_dues, ...duesData } = rowToSave;
      putDues(duesData, {
        onSuccess: () => {
          setEditingRow(null);
        },
        onError: (error) => {
          console.error('회비 수정 실패:', error);
          toast.error('회비 수정에 실패했습니다.');
        }
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, id: string, field: keyof GetYearDuesResp) => {
    setTableData(tableData.map((row) => {
      if (row.id === id) {
        return { ...row, [field]: e.target.value };
      }
      return row;
    }));
  };

  const handleSelectChange = (value: string, id: string, field: keyof GetYearDuesResp) => {
    setTableData(tableData.map((row) => {
      if (row.id === id) {
        return { ...row, [field]: value };
      }
      return row;
    }));
  };

  const handleDateChange = (value: string | undefined, id: string) => {
    if (!value) return;
    const formattedDate = dayjs(value).format('YYYY-MM-DD');
    setTableData(tableData.map((row) => {
      if (row.id === id) {
        return { ...row, dues_date: formattedDate };
      }
      return row;
    }));
  };

  return (
    <Card className='flex-1'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle>입출금 내역</CardTitle>
          <PermissionGuard requiredPermission="DUES:MANAGE">
            <Button className='text-sm h-8' onClick={handleAdd}>추가</Button>
          </PermissionGuard>
        </div>
      </CardHeader>
      <CardContent>
        <DuesTableContent
          data={tableData}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          rowsPerPage={rowsPerPage}
          editingRow={editingRow}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onCopy={handleCopy}
          onSaveRow={handleSaveRow}
          onInputChange={handleInputChange}
          onSelectChange={handleSelectChange}
          onDateChange={handleDateChange}
        />
      </CardContent>
    </Card>
  );
};

export default DuesTable;