import { ApplicationContent } from '@/features/vacation-application/ui/ApplicationContent';
import { ApplicationProvider } from '@/features/vacation-application/model/ApplicationContext';

const ApplicationPage = () => {
  return (
    <ApplicationProvider>
      <ApplicationContent />
    </ApplicationProvider>
  );
};

export { ApplicationPage };
