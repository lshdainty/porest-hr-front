import { Button } from '@/components/shadcn/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/shadcn/table';
import { useWorkDivisionQuery } from '@/hooks/queries/useWorks';
import { WorkCodeResp } from '@/lib/api/work';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import WorkCodeDeleteDialog from './WorkCodeDeleteDialog';
import WorkCodeEditDialog from './WorkCodeEditDialog';

const WorkDivisionList = () => {
  const { data: workDivisions, isLoading } = useWorkDivisionQuery();
  const [editingCode, setEditingCode] = useState<WorkCodeResp | null>(null);
  const [deletingCode, setDeletingCode] = useState<WorkCodeResp | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleCreate = () => {
    setEditingCode(null);
    setIsEditOpen(true);
  };

  const handleEdit = (code: WorkCodeResp) => {
    setEditingCode(code);
    setIsEditOpen(true);
  };

  const handleDelete = (code: WorkCodeResp) => {
    setDeletingCode(code);
    setIsDeleteOpen(true);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => handleCreate()}>
          <Plus className="mr-2 h-4 w-4" />
          업무 구분 추가
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">코드명</TableHead>
              <TableHead>코드</TableHead>
              <TableHead>타입</TableHead>
              <TableHead>순서</TableHead>
              <TableHead className="text-right">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workDivisions?.map((division) => (
              <TableRow key={division.work_code_seq}>
                <TableCell className="font-medium pl-4">
                  {division.work_code_name}
                </TableCell>
                <TableCell>{division.work_code}</TableCell>
                <TableCell>{division.code_type}</TableCell>
                <TableCell>{division.order_seq}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(division)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(division)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <WorkCodeEditDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        workCode={editingCode}
        onSuccess={() => {
          // Refetch is handled by React Query invalidation
        }}
      />

      <WorkCodeDeleteDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        workCode={deletingCode}
        onSuccess={() => {
          setDeletingCode(null);
        }}
      />
    </div>
  );
};

export default WorkDivisionList;
