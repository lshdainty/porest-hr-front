import DuesContent from '@/features/culture/dues/components/DuesContent';
import { DuesProvider } from '@/features/culture/dues/contexts/DuesContext';

const DuesPage = () => {
  return (
    <DuesProvider>
      <DuesContent />
    </DuesProvider>
  );
};

export default DuesPage;