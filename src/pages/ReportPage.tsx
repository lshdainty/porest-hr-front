import { ReportContent } from '@/features/work/report/components/ReportContent';
import { ReportProvider } from '@/features/work/report/contexts/ReportContext';

const ReportPage = () => {
  return (
    <ReportProvider>
      <ReportContent />
    </ReportProvider>
  );
};

export { ReportPage };
