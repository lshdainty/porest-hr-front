import { Button } from '@/components/shadcn/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/shadcn/table';
import { useWorkGroupsWithPartsQuery } from '@/hooks/queries/useWorks';
import { WorkCodeResp } from '@/lib/api/work';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import WorkCodeDeleteDialog from './WorkCodeDeleteDialog';
import WorkCodeEditDialog from './WorkCodeEditDialog';

const WorkCodeList = () => {
  const { data: workGroups, isLoading } = useWorkGroupsWithPartsQuery();
  const [editingCode, setEditingCode] = useState<WorkCodeResp | null>(null);
  const [deletingCode, setDeletingCode] = useState<WorkCodeResp | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [parentSeq, setParentSeq] = useState<number | undefined>(undefined);

  const handleCreate = (parentSeq?: number) => {
    setEditingCode(null);
    setParentSeq(parentSeq);
    setIsEditOpen(true);
  };

  const handleEdit = (code: WorkCodeResp) => {
    setEditingCode(code);
    setParentSeq(code.parent_work_code_seq);
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
          최상위 그룹 추가
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
            {workGroups?.map((group) => (
              <>
                {/* Group Row */}
                <TableRow key={group.work_code_seq} className="bg-muted/50">
                  <TableCell className="font-medium pl-4">
                    {group.work_code_name}
                  </TableCell>
                  <TableCell>{group.work_code}</TableCell>
                  <TableCell>{group.code_type}</TableCell>
                  <TableCell>{group.order_seq}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCreate(group.work_code_seq)}
                        title="하위 코드 추가"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(group)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(group)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                
                {/* Parts Rows */}
                {group.parts?.map((part) => (
                  <TableRow key={part.work_code_seq}>
                    <TableCell className="pl-12">
                      └ {part.work_code_name}
                    </TableCell>
                    <TableCell>{part.work_code}</TableCell>
                    <TableCell>{part.code_type}</TableCell>
                    <TableCell>{part.order_seq}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(part)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(part)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </>
            ))}
          </TableBody>
        </Table>
      </div>

      <WorkCodeEditDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        workCode={editingCode}
        parentWorkCodeSeq={parentSeq}
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

export default WorkCodeList;
