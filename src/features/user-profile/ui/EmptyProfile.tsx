import { Empty, EmptyDescription, EmptyHeader, EmptyIcon, EmptyTitle } from '@/shared/ui/shadcn/empty';
import { UserX } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface EmptyProfileProps {
  className?: string;
}

const EmptyProfile = ({ className }: EmptyProfileProps) => {
  const { t } = useTranslation('user');

  return (
    <Empty className={className}>
      <EmptyHeader>
        <EmptyIcon>
          <UserX />
        </EmptyIcon>
        <EmptyTitle>{t('empty.title')}</EmptyTitle>
        <EmptyDescription>
          {t('empty.description')}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
};

export { EmptyProfile };
