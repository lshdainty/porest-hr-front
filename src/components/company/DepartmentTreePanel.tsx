import { useState } from 'react';
import { Plus, Edit, Trash2, Building2 } from 'lucide-react';
import { Button } from '@/components/shadcn/button';
import DepartmentFormDialog from '@/components/company/DepartmentFormDialog';
import { TreeView, TreeDataItem } from '@/components/shadcn/treeView';
import { GetCompanyWithDepartment } from '@/api/company';
import { toast } from '@/components/alert/toast';

interface DepartmentTreePanelProps {
  departments: GetCompanyWithDepartment[];
  selectedDept: GetCompanyWithDepartment | null;
  onDeptSelect: (dept: GetCompanyWithDepartment) => void;
  onDeptUpdate: (formData: any) => void;
  onDeptDelete: (deptId: number) => void;
  companyId: string;
}

export default function DepartmentTreePanel({
  departments,
  selectedDept,
  onDeptSelect,
  onDeptUpdate,
  onDeptDelete,
  companyId,
}: DepartmentTreePanelProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<GetCompanyWithDepartment | null>(null);
  const [addingChildToId, setAddingChildToId] = useState<number | null>(null);

  const handleAddChild = (parentId: number) => {
    setAddingChildToId(parentId);
    const parentDept = findDeptById(departments, parentId);
    setEditingDept(parentDept);
    setIsDialogOpen(true);
  };

  const handleEdit = (dept: GetCompanyWithDepartment) => {
    setEditingDept(dept);
    setAddingChildToId(null);
    setIsDialogOpen(true);
  };

  const handleSave = (formData: any) => {
    onDeptUpdate(formData);
    setIsDialogOpen(false);
    setEditingDept(null);
    setAddingChildToId(null);
  };

  const handleSelectChange = (item?: TreeDataItem) => {
    if (!item) return;
    const dept = findDeptById(departments, Number(item.id));
    if (dept) onDeptSelect(dept);
  };

  const handleDelete = (dept: GetCompanyWithDepartment) => {
    if (dept.children && dept.children.length > 0) {
      toast.error('하위 부서가 있어 삭제할 수 없습니다.');
      return;
    }
    onDeptDelete(dept.department_id);
  };

  const mapDeptToTreeItem = (dept: GetCompanyWithDepartment): TreeDataItem => ({
    id: dept.department_id.toString(),
    name: dept.department_name_kr,
    icon: Building2,
    actions: (
      <div className="flex space-x-1 items-center" onClick={e => e.stopPropagation()}>
        <div
          role="button"
          tabIndex={0}
          className="inline-flex items-center justify-center size-6 rounded-md hover:border hover:border-input hover:bg-background cursor-pointer transition-colors"
          onClick={e => {
            e.stopPropagation();
            handleAddChild(dept.department_id);
          }}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.stopPropagation();
              handleAddChild(dept.department_id);
            }
          }}
          title="하위 부서 추가"
        >
          <Plus size={16} strokeWidth={1.5} />
        </div>
        <div
          role="button"
          tabIndex={0}
          className="inline-flex items-center justify-center size-6 rounded-md hover:border hover:border-input hover:bg-background cursor-pointer transition-colors"
          onClick={e => {
            e.stopPropagation();
            handleEdit(dept);
          }}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.stopPropagation();
              handleEdit(dept);
            }
          }}
          title="수정"
        >
          <Edit size={16} strokeWidth={1.5} />
        </div>
        <div
          role="button"
          tabIndex={0}
          className="inline-flex items-center justify-center size-6 rounded-md hover:border hover:border-input hover:bg-background cursor-pointer transition-colors"
          onClick={e => {
            e.stopPropagation();
            handleDelete(dept);
          }}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.stopPropagation();
              handleDelete(dept);
            }
          }}
          title="삭제"
        >
          <Trash2 size={16} strokeWidth={1.5} />
        </div>
      </div>
    ),
    children: dept.children?.map(mapDeptToTreeItem),
    draggable: true,
    droppable: true,
  });

  const findDeptById = (depts: GetCompanyWithDepartment[], id: number): GetCompanyWithDepartment | null => {
    for (const dept of depts) {
      if (dept.department_id === id) return dept;
      if (dept.children) {
        const found = findDeptById(dept.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const treeData = departments.map(mapDeptToTreeItem);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* 헤더 - 고정 */}
      <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
        <h2 className="text-lg font-semibold">부서 관리</h2>
        <Button size="sm" onClick={() => {
          setEditingDept(null);
          setAddingChildToId(null);
          setIsDialogOpen(true);
        }}>
          <Plus size={16} className="mr-2" />
          부서 추가
        </Button>
      </div>
      
      {/* 트리 영역 - 스크롤 가능 */}
      <div className="flex-1 min-h-0 p-4 overflow-y-auto">
        {departments.length > 0 ? (
          <TreeView
            data={treeData}
            initialSelectedItemId={selectedDept?.department_id.toString()}
            onSelectChange={handleSelectChange}
            expandAll={false}
            className="bg-transparent"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Building2 size={48} className="mb-4 text-muted-foreground" />
            <p>부서가 없습니다</p>
          </div>
        )}
      </div>
      
      <DepartmentFormDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSave}
        initialData={editingDept}
        isEditing={!!editingDept && !addingChildToId}
        isAddingChild={!!addingChildToId}
        parentId={addingChildToId}
        companyId={companyId}
      />
    </div>
  );
}
