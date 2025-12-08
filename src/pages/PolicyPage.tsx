import { PolicyContent } from '@/features/admin/vacation/policy/components/PolicyContent';
import { PolicyProvider } from '@/features/admin/vacation/policy/contexts/PolicyContext';

const PolicyPage = () => {
  return (
    <PolicyProvider>
      <PolicyContent />
    </PolicyProvider>
  );
};

export { PolicyPage };
