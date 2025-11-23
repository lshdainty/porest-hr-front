import ReportFilterSkeleton from '@/features/work/report/components/ReportFilterSkeleton';
import ReportHeaderSkeleton from '@/features/work/report/components/ReportHeaderSkeleton';
import ReportTableSkeleton from '@/features/work/report/components/ReportTableSkeleton';

const ReportSkeleton = () => {
  return (
    <div className='p-4 sm:p-6 md:p-8'>
      <ReportHeaderSkeleton />
      <ReportFilterSkeleton />
      <div className="mt-6">
        <ReportTableSkeleton />
      </div>
    </div>
  );
};

export default ReportSkeleton;
