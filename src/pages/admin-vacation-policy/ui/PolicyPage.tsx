import { PolicyContent } from '@/features/admin-vacation-policy/ui/PolicyContent';
import { PolicyProvider } from '@/features/admin-vacation-policy/model/PolicyContext';

const PolicyPage = () => {
  return (
    <PolicyProvider>
      <PolicyContent />
    </PolicyProvider>
  );
};

export { PolicyPage };
