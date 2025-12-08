import { ApplicationContent } from '@/features/vacation/application/components/ApplicationContent';
import { ApplicationProvider } from '@/features/vacation/application/contexts/ApplicationContext';

const ApplicationPage = () => {
  return (
    <ApplicationProvider>
      <ApplicationContent />
    </ApplicationProvider>
  );
};

export { ApplicationPage };
