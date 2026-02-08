import { Empty, EmptyDescription, EmptyHeader, EmptyIcon, EmptyTitle } from '@/shared/ui/shadcn/empty';
import { Building2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface EmptyDepartmentProps {
  className?: string;
}

const EmptyDepartment = ({ className }: EmptyDepartmentProps) => {
  const { t } = useTranslation('admin');

  return (
    <Empty className={className}>
      <EmptyHeader>
        <EmptyIcon variant="default">
          <Building2 />
        </EmptyIcon>
        <EmptyTitle>{t('department.noDepartments')}</EmptyTitle>
        <EmptyDescription>
          {t('department.noDepartmentsDesc')}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
};

export { EmptyDepartment };
