import { Empty, EmptyDescription, EmptyHeader, EmptyIcon, EmptyTitle } from '@/components/shadcn/empty';
import { BarChart3 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface EmptyVacationStatsProps {
  className?: string;
}

const EmptyVacationStats = ({ className }: EmptyVacationStatsProps) => {
  const { t } = useTranslation('vacation');

  return (
    <Empty className={className}>
      <EmptyHeader>
        <EmptyIcon>
          <BarChart3 />
        </EmptyIcon>
        <EmptyTitle>{t('history.noDataMessage')}</EmptyTitle>
        <EmptyDescription>
          {t('history.noDataMessageDesc')}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
};

export default EmptyVacationStats;
