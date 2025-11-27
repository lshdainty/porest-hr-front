import { Button } from '@/components/shadcn/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/shadcn/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/shadcn/form';
import { Input } from '@/components/shadcn/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/shadcn/select';
import { usePostCreateWorkCodeMutation, usePutUpdateWorkCodeMutation } from '@/hooks/queries/useWorks';
import { CodeType, WorkCodeResp } from '@/lib/api/work';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z.object({
  work_code: z.string().min(1, '코드를 입력해주세요.'),
  work_code_name: z.string().min(1, '코드명을 입력해주세요.'),
  code_type: z.enum(['LABEL', 'OPTION']),
  parent_work_code_seq: z.number().optional(),
  order_seq: z.coerce.number().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface WorkCodeEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workCode: WorkCodeResp | null;
  parentWorkCodeSeq?: number; // For creating child codes
  onSuccess?: () => void;
}

const WorkCodeEditDialog = ({
  open,
  onOpenChange,
  workCode,
  parentWorkCodeSeq,
  onSuccess
}: WorkCodeEditDialogProps) => {
  const { mutate: createWorkCode, isPending: isCreatePending } = usePostCreateWorkCodeMutation();
  const { mutate: updateWorkCode, isPending: isUpdatePending } = usePutUpdateWorkCodeMutation();

  const isPending = isCreatePending || isUpdatePending;
  const isEdit = !!workCode;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any, // Temporary fix for type mismatch
    defaultValues: {
      work_code: '',
      work_code_name: '',
      code_type: 'LABEL',
      parent_work_code_seq: undefined,
      order_seq: 0,
    },
  });

  useEffect(() => {
    if (open) {
      if (workCode) {
        form.reset({
          work_code: workCode.work_code,
          work_code_name: workCode.work_code_name,
          code_type: workCode.code_type as CodeType,
          parent_work_code_seq: workCode.parent_work_code_seq,
          order_seq: workCode.order_seq,
        });
      } else {
        form.reset({
          work_code: '',
          work_code_name: '',
          code_type: 'LABEL',
          parent_work_code_seq: parentWorkCodeSeq,
          order_seq: 0,
        });
      }
    }
  }, [open, workCode, parentWorkCodeSeq, form]);

  const onSubmit = (values: FormValues) => {
    if (isEdit && workCode) {
      updateWorkCode({
        work_code_seq: workCode.work_code_seq,
        work_code: values.work_code,
        work_code_name: values.work_code_name,
        parent_work_code_seq: values.parent_work_code_seq,
        order_seq: values.order_seq,
      }, {
        onSuccess: () => {
          onOpenChange(false);
          onSuccess?.();
        }
      });
    } else {
      createWorkCode({
        work_code: values.work_code,
        work_code_name: values.work_code_name,
        code_type: values.code_type as CodeType,
        parent_work_code_seq: values.parent_work_code_seq,
        order_seq: values.order_seq,
      }, {
        onSuccess: () => {
          onOpenChange(false);
          onSuccess?.();
        }
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? '업무 코드 수정' : '업무 코드 생성'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="work_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>코드</FormLabel>
                  <FormControl>
                    <Input placeholder="WORK_CODE" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="work_code_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>코드명</FormLabel>
                  <FormControl>
                    <Input placeholder="업무 코드명" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="code_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>타입</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="타입 선택" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="LABEL">LABEL</SelectItem>
                      <SelectItem value="OPTION">OPTION</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="order_seq"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>정렬 순서</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? '저장 중...' : '저장'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default WorkCodeEditDialog;
