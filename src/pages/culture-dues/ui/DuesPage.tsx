import { DuesContent } from '@/features/culture-dues/ui/DuesContent';
import { DuesProvider } from '@/features/culture-dues/model/DuesContext';

const DuesPage = () => {
  return (
    <DuesProvider>
      <DuesContent />
    </DuesProvider>
  );
};

export { DuesPage };