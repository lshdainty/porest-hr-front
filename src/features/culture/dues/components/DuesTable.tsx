import PermissionGuard from '@/components/auth/PermissionGuard';
import { Button } from '@/components/shadcn/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card';
import { useDeleteDuesMutation, usePostDuesMutation, usePutDuesMutation } from '@/hooks/queries/useDues';
import { GetYearDuesResp } from '@/lib/api/dues';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import DuesTableContent, { EditableDuesData } from './DuesTableContent';

interface ModifiedData {
  created: EditableDuesData[];
  updated: UpdateDuesData[];
  deleted: number[];
}

type UpdateDuesData = GetYearDuesResp & { id: string };

interface DuesTableProps {
  yearDues?: GetYearDuesResp[];
}

const DuesTable = ({ yearDues = [] }: DuesTableProps) => {
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

  return (
    <Card className='flex-1'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle>입출금 내역</CardTitle>
          <PermissionGuard requiredPermission="DUES:MANAGE">
            <div className='flex gap-2'>
              <Button className='text-sm h-8' onClick={handleAdd}>추가</Button>
              <Button className='text-sm h-8' variant='outline' onClick={handleSave}>저장</Button>
            </div>
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
          onSaveRow={() => setEditingRow(null)}
          onInputChange={handleInputChange}
          onSelectChange={handleSelectChange}
          onDateChange={handleDateChange}
        />
      </CardContent>
    </Card>
  );
};

export default DuesTable;