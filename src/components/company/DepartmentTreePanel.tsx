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
    setEditingDept(parentDept); // 부모 부서 정보 (트리 레벨 계산용)
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
    // 자식 노드가 있는지 확인
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
      <div className="flex space-x-1 items-center">
        <Button
          variant="ghost"
          size="icon"
          className="size-6 hover:border hover:border-input hover:bg-background"
          onClick={e => {
            e.stopPropagation();
            handleAddChild(dept.department_id);
          }}
          title="하위 부서 추가"
        >
          <Plus 
            size={10} 
            strokeWidth={1.5}
          />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-6 hover:border hover:border-input hover:bg-background"
          onClick={e => {
            e.stopPropagation();
            handleEdit(dept);
          }}
          title="수정"
        >
          <Edit 
            size={10} 
            strokeWidth={1.5}
          />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-6 hover:border hover:border-input hover:bg-background"
          onClick={e => {
            e.stopPropagation();
            handleDelete(dept);
          }}
          title="삭제"
        >
          <Trash2
            size={10}
            strokeWidth={1.5}
          />
        </Button>
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
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
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
      <div className="flex-1 p-4 overflow-y-auto">
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
};
