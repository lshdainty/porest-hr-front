import { Button } from '@/components/shadcn/button';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyIcon, EmptyTitle } from '@/components/shadcn/empty';
import { Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface EmptyHolidayProps {
  onAddClick?: () => void;
  className?: string;
}

const EmptyHoliday = ({ onAddClick, className }: EmptyHolidayProps) => {
  const { t } = useTranslation('admin');

  return (
    <Empty className={className}>
      <EmptyHeader>
        <EmptyIcon>
          <Calendar />
        </EmptyIcon>
        <EmptyTitle>{t('holiday.noHolidays')}</EmptyTitle>
        <EmptyDescription>
          {t('holiday.noHolidaysDesc')}
        </EmptyDescription>
      </EmptyHeader>
      {onAddClick && (
        <EmptyContent>
          <Button onClick={onAddClick}>
            <Calendar className="h-4 w-4 mr-2" />
            {t('holiday.addFirst')}
          </Button>
        </EmptyContent>
      )}
    </Empty>
  );
};

export default EmptyHoliday;
