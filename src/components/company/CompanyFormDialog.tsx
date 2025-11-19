import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/shadcn/input';
import { Button } from '@/components/shadcn/button';
import { Textarea } from '@/components/shadcn/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/shadcn/dialog';
import { Field, FieldLabel, FieldError } from '@/components/shadcn/field';
import { Spinner } from '@/components/shadcn/spinner';
import { PostCompanyReq, PutCompanyReq } from '@/lib/api/company';

const companyFormSchema = z.object({
  company_id: z.string().min(1, { message: '회사 ID를 입력해주세요.' }),
  company_name: z.string().min(1, { message: '회사명을 입력해주세요.' }),
  company_desc: z.string().optional(),
});

type CompanyFormValues = z.infer<typeof companyFormSchema>;

interface CompanyFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (formData: PostCompanyReq | { companyId: string; data: PutCompanyReq }) => void;
  initialData?: Partial<PostCompanyReq>;
  mode?: 'create' | 'edit';
}

export default function CompanyFormDialog({
  isOpen,
  onOpenChange,
  onSave,
  initialData = {},
  mode = 'create'
}: CompanyFormDialogProps) {
  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      company_id: '',
      company_name: '',
      company_desc: '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (isOpen && initialData) {
      form.reset({
        company_id: initialData.company_id || '',
        company_name: initialData.company_name || '',
        company_desc: initialData.company_desc || '',
      });
    }
  }, [isOpen, form, initialData]);

  const onSubmit = (values: CompanyFormValues): void => {
    if (mode === 'edit') {
      onSave({
        companyId: values.company_id,
        data: {
          company_name: values.company_name,
          company_desc: values.company_desc || '',
        }
      });
    } else {
      onSave({
        company_id: values.company_id,
        company_name: values.company_name,
        company_desc: values.company_desc || '',
      });
    }
  };

  const handleOpenChange = (open: boolean): void => {
    if (!open) {
      form.reset();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>{mode === 'edit' ? '회사 정보 수정' : '회사 정보 입력'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <Controller
            control={form.control}
            name='company_id'
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel>
                  회사 ID
                  <span className='text-destructive ml-0.5'>*</span>
                </FieldLabel>
                <Input
                  placeholder='회사 ID를 입력하세요'
                  {...field}
                  disabled={mode === 'edit'}
                />
                <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name='company_name'
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel>
                  회사명
                  <span className='text-destructive ml-0.5'>*</span>
                </FieldLabel>
                <Input placeholder='회사명을 입력하세요' {...field} />
                <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name='company_desc'
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel>회사소개</FieldLabel>
                <Textarea
                  placeholder='회사에 대한 간단한 소개를 입력하세요'
                  rows={4}
                  {...field}
                />
                <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
              </Field>
            )}
          />
          <div className='flex justify-end space-x-2 pt-4'>
            <Button
              type='button'
              variant='secondary'
              onClick={() => handleOpenChange(false)}
            >
              취소
            </Button>
            <Button
              type='submit'
              disabled={!form.formState.isValid || form.formState.isSubmitting}
            >
              {form.formState.isSubmitting && <Spinner />}
              {form.formState.isSubmitting ? '저장 중...' : '저장'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};