import { toast } from '@/components/shadcn/sonner';
import { Button } from '@/components/shadcn/button';
import { TreeDataItem, TreeView } from '@/components/shadcn/treeView';
import EmptyDepartment from '@/features/admin/company/components/EmptyDepartment';
import { GetCompanyWithDepartment } from '@/lib/api/company';
import { PutDepartmentReq } from '@/lib/api/department';
import { Building2, Edit, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DepartmentFormDialog from '@/features/admin/company/components/DepartmentFormDialog';

interface DepartmentTreePanelProps {
  departments: GetCompanyWithDepartment[];
  selectedDept: GetCompanyWithDepartment | null;
  onDeptSelect: (dept: GetCompanyWithDepartment) => void;
  onDeptUpdate: (formData: any) => void;
  onDeptDelete: (deptId: number) => void;
  companyId: string;
  title?: string;
  showAddButton?: boolean;
  showNodeActions?: boolean;
  disableCollapse?: boolean;
}

const DepartmentTreePanel = ({
  departments,
  selectedDept,
  onDeptSelect,
  onDeptUpdate,
  onDeptDelete,
  companyId,
  title,
  showAddButton = true,
  showNodeActions = true,
  disableCollapse = false,
}: DepartmentTreePanelProps) => {
  const { t } = useTranslation('admin');
  const displayTitle = title ?? t('department.title');
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
      toast.error(t('department.hasChildrenError'));
      return;
    }
    onDeptDelete(dept.department_id);
  };

  const handleDragDrop = (sourceItem: TreeDataItem, targetItem: TreeDataItem) => {
    // 드래그된 부서 찾기
    const draggedDept = findDeptById(departments, Number(sourceItem.id));
    if (!draggedDept) {
      return;
    }

    // 드롭된 위치의 부서 찾기
    const targetDept = findDeptById(departments, Number(targetItem.id));
    if (!targetDept) {
      return;
    }

    // 부서를 자기 자신에게 드롭하는 경우 무시
    if (draggedDept.department_id === targetDept.department_id) {
      return;
    }

    // 업데이트할 데이터 준비
    const data: PutDepartmentReq = {
      department_name: draggedDept.department_name,
      department_name_kr: draggedDept.department_name_kr,
      parent_id: targetDept.department_id,
      head_user_id: draggedDept.head_user_id || undefined,
      color_code: draggedDept.color_code || undefined,
      tree_level: targetDept.tree_level + 1,
      department_desc: draggedDept.department_desc || undefined,
      company_id: companyId || undefined,
    };

    const updateData = {
      departmentId: draggedDept.department_id,
      data
    };

    // 부서 업데이트
    onDeptUpdate(updateData);
  };

  const mapDeptToTreeItem = (dept: GetCompanyWithDepartment): TreeDataItem => ({
    id: dept.department_id.toString(),
    name: dept.department_name_kr,
    icon: Building2,
    actions: showNodeActions ? (
      <div className='flex space-x-1 items-center' onClick={e => e.stopPropagation()}>
        <div
          role='button'
          tabIndex={0}
          className='inline-flex items-center justify-center size-6 rounded-md hover:border hover:border-input hover:bg-background cursor-pointer transition-colors'
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
          title={t('department.addSubBtn')}
        >
          <Plus size={16} strokeWidth={1.5} />
        </div>
        <div
          role='button'
          tabIndex={0}
          className='inline-flex items-center justify-center size-6 rounded-md hover:border hover:border-input hover:bg-background cursor-pointer transition-colors'
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
          title={t('department.editBtn')}
        >
          <Edit size={16} strokeWidth={1.5} />
        </div>
        <div
          role='button'
          tabIndex={0}
          className='inline-flex items-center justify-center size-6 rounded-md hover:border hover:border-input hover:bg-background cursor-pointer transition-colors'
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
          title={t('department.deleteBtn')}
        >
          <Trash2 size={16} strokeWidth={1.5} />
        </div>
      </div>
    ) : undefined,
    children: dept.children && dept.children.length > 0 ? dept.children.map(mapDeptToTreeItem) : undefined,
    draggable: dept.parent_id !== null,
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

  // department_level이 0인 항목이 하나라도 있는지 확인
  const hasLevelZeroDept = departments.some(dept => dept.tree_level === 0);

  return (
    <div className='h-full flex flex-col overflow-hidden'>
      {/* 헤더 - 고정 */}
      <div className='flex items-center justify-between p-4 border-b flex-shrink-0'>
        <h2 className='text-lg font-semibold'>{displayTitle}</h2>
        {showAddButton && (
          <Button
            size='sm'
            disabled={hasLevelZeroDept}
            onClick={() => {
              setEditingDept(null);
              setAddingChildToId(null);
              setIsDialogOpen(true);
            }}
          >
            <Plus size={16} />
            {t('department.addBtn')}
          </Button>
        )}
      </div>
      
      {/* 트리 영역 - 스크롤 가능 */}
      <div className='flex-1 min-h-0 p-4 overflow-y-auto'>
        {departments.length > 0 ? (
          <TreeView
            data={treeData}
            initialSelectedItemId={selectedDept?.department_id.toString()}
            onSelectChange={handleSelectChange}
            expandAll={true}
            onDocumentDrag={handleDragDrop}
            className='bg-transparent'
            disableCollapse={disableCollapse}
          />
        ) : (
          <EmptyDepartment className="h-full" />
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
  )
}

export default DepartmentTreePanel
