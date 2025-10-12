import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/shadcn/dialog';
import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { Textarea } from '@/components/shadcn/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/shadcn/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/shadcn/select';
import { PostDepartmentReq, PutDepartmentReq } from '@/api/department';
import { useGetUsers } from '@/api/user';

const departmentFormSchema = z.object({
  department_name: z.string().min(1, { message: '영문 부서명을 입력해주세요.' }),
  department_name_kr: z.string().min(1, { message: '한글 부서명을 입력해주세요.' }),
  parent_id: z.number().nullable(),
  head_user_id: z.string().optional(),
  tree_level: z.number().optional(),
  department_desc: z.string().optional(),
  company_id: z.string().optional(),
});

type DepartmentFormValues = z.infer<typeof departmentFormSchema>;

interface DepartmentFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (formData: PostDepartmentReq | { departmentId: number; data: PutDepartmentReq }) => void;
  initialData?: any;
  isEditing?: boolean;
  isAddingChild?: boolean;
  parentId?: number | null;
  companyId?: string;
}

export default function DepartmentFormDialog({
  isOpen,
  onOpenChange,
  onSave,
  initialData = null,
  isEditing = false,
  isAddingChild = false,
  parentId,
  companyId
}: DepartmentFormDialogProps) {
  const { data: users, isLoading: usersLoading } = useGetUsers();

  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentFormSchema),
    defaultValues: {
      department_name: '',
      department_name_kr: '',
      parent_id: null,
      head_user_id: '',
      tree_level: 0,
      department_desc: '',
      company_id: '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (isOpen) {
      if (isEditing && initialData) {
        form.reset({
          department_name: initialData.department_name || '',
          department_name_kr: initialData.department_name_kr || '',
          parent_id: initialData.parent_id ?? null,
          head_user_id: initialData.head_user_id || '',
          tree_level: initialData.tree_level || 0,
          department_desc: initialData.department_desc || '',
          company_id: initialData.company_id || companyId || '',
        });
      } else {
        form.reset({
          department_name: '',
          department_name_kr: '',
          parent_id: isAddingChild && typeof parentId === 'number' ? parentId : null,
          head_user_id: '',
          tree_level: isAddingChild && typeof parentId === 'number' && initialData ? (initialData.tree_level || 0) + 1 : 0,
          department_desc: '',
          company_id: companyId || '',
        });
      }
    }
  }, [isOpen, isEditing, initialData, form]);

  const onSubmit = (values: DepartmentFormValues): void => {
    if (isEditing && !isAddingChild && initialData?.department_id) {
      // 수정 모드
      const updateData: PutDepartmentReq = {
        department_name: values.department_name,
        department_name_kr: values.department_name_kr,
        parent_id: values.parent_id,
        head_user_id: values.head_user_id || undefined,
        tree_level: values.tree_level,
        department_desc: values.department_desc || undefined,
        company_id: values.company_id || undefined,
      };
      onSave({ departmentId: initialData.department_id, data: updateData });
    } else {
      // 생성 모드 (새 부서 또는 하위 부서 추가)
      const createData: PostDepartmentReq = {
        department_name: values.department_name,
        department_name_kr: values.department_name_kr,
        parent_id: values.parent_id,
        head_user_id: values.head_user_id || undefined,
        tree_level: values.tree_level,
        department_desc: values.department_desc || undefined,
        company_id: values.company_id || undefined,
      };
      onSave(createData);
    }
  };

  const getDialogTitle = () => {
    if (isAddingChild) return '하위 부서 추가';
    if (isEditing) return '부서 수정';
    return '부서 추가';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="department_name_kr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>한글 부서명 *</FormLabel>
                    <FormControl>
                      <Input placeholder="예: 인사팀" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="department_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>영문 부서명 *</FormLabel>
                    <FormControl>
                      <Input placeholder="예: HR Team" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="head_user_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>부서장</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value === 'none' ? '' : value)
                    }}
                    value={field.value || 'none'}
                    disabled={usersLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="부서장을 선택해주세요" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">부서장을 선택해주세요</SelectItem>
                      {users?.map((user) => (
                        <SelectItem key={user.user_id} value={user.user_id}>
                          {user.user_name} ({user.user_id})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="department_desc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>부서설명</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="부서에 대한 설명을 입력하세요"
                      rows={2}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => onOpenChange(false)}
              >
                취소
              </Button>
              <Button 
                type="submit"
                disabled={!form.formState.isValid || form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? '저장 중...' : '저장'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};