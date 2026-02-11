import { Empty, EmptyDescription, EmptyHeader, EmptyIcon, EmptyTitle } from '@/shared/ui/shadcn/empty';
import { FileText, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface EmptyPlanProps {
  isSearchResult?: boolean;
  className?: string;
}

const EmptyPlan = ({ isSearchResult = false, className }: EmptyPlanProps) => {
  const { t } = useTranslation('vacation');

  return (
    <Empty className={className}>
      <EmptyHeader>
        <EmptyIcon>
          {isSearchResult ? <Search /> : <FileText />}
        </EmptyIcon>
        <EmptyTitle>
          {isSearchResult ? t('plan.noSearchResults') : t('plan.noPlans')}
        </EmptyTitle>
        <EmptyDescription>
          {isSearchResult
            ? t('plan.noSearchResultsDesc')
            : t('plan.noPlansDesc')}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
};

export { EmptyPlan };
