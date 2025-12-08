import { Empty, EmptyDescription, EmptyHeader, EmptyIcon, EmptyTitle } from '@/components/shadcn/empty';
import { FileText, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface EmptyPolicyProps {
  isSearchResult?: boolean;
  className?: string;
}

const EmptyPolicy = ({ isSearchResult = false, className }: EmptyPolicyProps) => {
  const { t } = useTranslation('vacation');

  return (
    <Empty className={className}>
      <EmptyHeader>
        <EmptyIcon>
          {isSearchResult ? <Search /> : <FileText />}
        </EmptyIcon>
        <EmptyTitle>
          {isSearchResult ? t('policy.noSearchResults') : t('policy.noPolicies')}
        </EmptyTitle>
        <EmptyDescription>
          {isSearchResult
            ? t('policy.noSearchResultsDesc')
            : t('policy.noPoliciesDesc')}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
};

export { EmptyPolicy };
