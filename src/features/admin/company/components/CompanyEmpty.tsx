import { CompanyCreateCard } from '@/features/admin/company/components/CompanyCreateCard';
import { type PostCompanyReq } from '@/lib/api/company';

interface CompanyEmptyProps {
  onCompanyCreate: (companyData: PostCompanyReq) => void;
}

const CompanyEmpty = ({ onCompanyCreate }: CompanyEmptyProps) => {
  return (
    <div className='h-full flex items-center justify-center overflow-hidden'>
      <CompanyCreateCard onCompanyCreate={onCompanyCreate} />
    </div>
  );
};

export { CompanyEmpty };
