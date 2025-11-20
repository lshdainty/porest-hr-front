import ReportFilterSkeleton from './ReportFilterSkeleton';
import ReportHeaderSkeleton from './ReportHeaderSkeleton';
import ReportTableSkeleton from './ReportTableSkeleton';

export default function ReportSkeleton() {
  return (
    <div className='p-4 sm:p-6 md:p-8'>
      <ReportHeaderSkeleton />
      <ReportFilterSkeleton />
      <div className="mt-6">
        <ReportTableSkeleton />
      </div>
    </div>
  );
}
