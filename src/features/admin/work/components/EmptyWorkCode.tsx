import { Button } from '@/components/shadcn/button';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyIcon, EmptyTitle } from '@/components/shadcn/empty';
import { cn } from '@/lib/utils';
import { Briefcase, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface EmptyWorkCodeProps {
  onAddClick?: () => void;
  className?: string;
}

const EmptyWorkCode = ({ onAddClick, className }: EmptyWorkCodeProps) => {
  const { t } = useTranslation('work');

  return (
    <Empty className={cn(className)}>
      <EmptyHeader>
        <EmptyIcon>
          <Briefcase />
        </EmptyIcon>
        <EmptyTitle>{t('noWorkCodes')}</EmptyTitle>
        <EmptyDescription>
          {t('noWorkCodesDesc')}
        </EmptyDescription>
      </EmptyHeader>
      {onAddClick && (
        <EmptyContent>
          <Button onClick={onAddClick}>
            <Plus className="h-4 w-4 mr-2" />
            {t('addWorkCode')}
          </Button>
        </EmptyContent>
      )}
    </Empty>
  );
};

export { EmptyWorkCode };
