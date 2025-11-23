import CompanyContent from '@/features/admin/company/components/CompanyContent';
import { CompanyProvider } from '@/features/admin/company/contexts/CompanyContext';

const CompanyPage = () => {
  return (
    <CompanyProvider>
      <CompanyContent />
    </CompanyProvider>
  );
};

export default CompanyPage;
