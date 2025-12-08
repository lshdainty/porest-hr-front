import { Button } from '@/components/shadcn/button';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyIcon, EmptyTitle } from '@/components/shadcn/empty';
import { FileText, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface EmptyReportProps {
  onAddClick?: () => void;
  className?: string;
}

const EmptyReport = ({ onAddClick, className }: EmptyReportProps) => {
  const { t } = useTranslation('work');

  return (
    <Empty className={className}>
      <EmptyHeader>
        <EmptyIcon>
          <FileText />
        </EmptyIcon>
        <EmptyTitle>{t('report.noHistory')}</EmptyTitle>
        <EmptyDescription>
          {t('report.noHistoryDesc')}
        </EmptyDescription>
      </EmptyHeader>
      {onAddClick && (
        <EmptyContent>
          <Button onClick={onAddClick}>
            <Plus className="h-4 w-4 mr-2" />
            {t('report.add')}
          </Button>
        </EmptyContent>
      )}
    </Empty>
  );
};

export { EmptyReport }
