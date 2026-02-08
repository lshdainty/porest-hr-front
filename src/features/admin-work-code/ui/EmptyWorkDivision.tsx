import { Button } from '@/shared/ui/shadcn/button';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyIcon, EmptyTitle } from '@/shared/ui/shadcn/empty';
import { cn } from '@/shared/lib'
import { Briefcase, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface EmptyWorkDivisionProps {
  onAddClick?: () => void;
  className?: string;
}

const EmptyWorkDivision = ({ onAddClick, className }: EmptyWorkDivisionProps) => {
  const { t } = useTranslation('work');

  return (
    <Empty className={cn(className)}>
      <EmptyHeader>
        <EmptyIcon>
          <Briefcase />
        </EmptyIcon>
        <EmptyTitle>{t('noWorkDivisions')}</EmptyTitle>
        <EmptyDescription>
          {t('noWorkDivisionsDesc')}
        </EmptyDescription>
      </EmptyHeader>
      {onAddClick && (
        <EmptyContent>
          <Button onClick={onAddClick}>
            <Plus className="h-4 w-4 mr-2" />
            {t('addWorkDivision')}
          </Button>
        </EmptyContent>
      )}
    </Empty>
  );
};

export { EmptyWorkDivision };
