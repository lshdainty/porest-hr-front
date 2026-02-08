import { CompanyContent } from '@/features/admin-company/ui/CompanyContent';
import { CompanyProvider } from '@/features/admin-company/model/CompanyContext';

const CompanyPage = () => {
  return (
    <CompanyProvider>
      <CompanyContent />
    </CompanyProvider>
  );
};

export { CompanyPage };
