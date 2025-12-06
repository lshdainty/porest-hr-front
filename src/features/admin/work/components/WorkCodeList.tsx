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
import { useTranslation } from 'react-i18next';
import WorkCodeDeleteDialog from './WorkCodeDeleteDialog';
import WorkCodeEditDialog from './WorkCodeEditDialog';

const WorkCodeList = () => {
  const { t } = useTranslation('work');
  const { data: workGroups, isLoading } = useWorkGroupsWithPartsQuery();
  const [editingCode, setEditingCode] = useState<WorkCodeResp | null>(null);
  const [deletingCode, setDeletingCode] = useState<WorkCodeResp | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [parentId, setParentId] = useState<number | undefined>(undefined);

  const handleCreate = (parentId?: number) => {
    setEditingCode(null);
    setParentId(parentId);
    setIsEditOpen(true);
  };

  const handleEdit = (code: WorkCodeResp) => {
    setEditingCode(code);
    setParentId(code.parent_work_code_id);
    setIsEditOpen(true);
  };

  const handleDelete = (code: WorkCodeResp) => {
    setDeletingCode(code);
    setIsDeleteOpen(true);
  };

  if (isLoading) {
    return <div>{t('loading')}</div>;
  }

  return (
    <div className="space-y-4">


      <div className="rounded-md border overflow-x-auto">
        <Table className="min-w-[800px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">{t('codeName')}</TableHead>
              <TableHead>{t('code')}</TableHead>
              <TableHead>{t('type')}</TableHead>
              <TableHead>{t('order')}</TableHead>
              <TableHead className="text-right">{t('manage')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workGroups?.map((group) => (
              <>
                {/* Group Row */}
                <TableRow key={group.work_code_id} className="bg-muted/50">
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
                        onClick={() => handleCreate(group.work_code_id)}
                        title={t('addSubCode')}
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
                  <TableRow key={part.work_code_id}>
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
        parentWorkCodeId={parentId}
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
