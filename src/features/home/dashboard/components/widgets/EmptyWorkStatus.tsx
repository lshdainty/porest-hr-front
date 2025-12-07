import { Empty, EmptyDescription, EmptyHeader, EmptyIcon, EmptyTitle } from '@/components/shadcn/empty';
import { Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface EmptyWorkStatusProps {
  className?: string;
}

const EmptyWorkStatus = ({ className }: EmptyWorkStatusProps) => {
  const { t } = useTranslation('dashboard');

  return (
    <Empty className={className}>
      <EmptyHeader>
        <EmptyIcon>
          <Clock />
        </EmptyIcon>
        <EmptyTitle>{t('workHistory.noData')}</EmptyTitle>
        <EmptyDescription>
          {t('workHistory.noDataDesc')}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
};

export default EmptyWorkStatus;
