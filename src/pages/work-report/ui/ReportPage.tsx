import { ReportContent } from '@/features/work-report/ui/ReportContent';
import { ReportProvider } from '@/features/work-report/model/ReportContext';

const ReportPage = () => {
  return (
    <ReportProvider>
      <ReportContent />
    </ReportProvider>
  );
};

export { ReportPage };
