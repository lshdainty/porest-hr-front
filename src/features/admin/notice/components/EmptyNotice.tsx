import { Button } from '@/components/shadcn/button';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyIcon, EmptyTitle } from '@/components/shadcn/empty';
import { Bell } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface EmptyNoticeProps {
  onAddClick?: () => void;
  className?: string;
}

const EmptyNotice = ({ onAddClick, className }: EmptyNoticeProps) => {
  const { t } = useTranslation('admin');

  return (
    <Empty className={className}>
      <EmptyHeader>
        <EmptyIcon>
          <Bell />
        </EmptyIcon>
        <EmptyTitle>{t('notice.noNotices')}</EmptyTitle>
        <EmptyDescription>
          {t('notice.noNoticesDesc')}
        </EmptyDescription>
      </EmptyHeader>
      {onAddClick && (
        <EmptyContent>
          <Button onClick={onAddClick}>
            <Bell className="h-4 w-4 mr-2" />
            {t('notice.addFirst')}
          </Button>
        </EmptyContent>
      )}
    </Empty>
  );
};

export { EmptyNotice }
