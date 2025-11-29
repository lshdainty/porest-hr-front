import TotalDuesItem, { getTotalDuesConfig } from '@/features/culture/dues/components/TotalDuesItem';
import TotalDuesSkeleton from '@/features/culture/dues/components/TotalDuesSkeleton';
import { GetMonthBirthDuesResp, GetYearOperationDuesResp } from '@/lib/api/dues';

interface TotalDuesWidgetProps {
  totalDues?: GetYearOperationDuesResp;
  birthDues?: GetMonthBirthDuesResp;
}

const TotalDuesWidget = ({ totalDues, birthDues }: TotalDuesWidgetProps) => {
  if (!totalDues || !birthDues) {
    return <TotalDuesSkeleton />;
  }

  const duesConfig = getTotalDuesConfig(totalDues, birthDues);

  return (
    <div className='grid grid-cols-1 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-border h-full bg-card'>
      {duesConfig.map((item) => (
        <div key={item.id} className='p-6 h-full relative overflow-hidden min-h-[120px]'>
          <TotalDuesItem {...item} />
        </div>
      ))}
    </div>
  );
};

export default TotalDuesWidget;
