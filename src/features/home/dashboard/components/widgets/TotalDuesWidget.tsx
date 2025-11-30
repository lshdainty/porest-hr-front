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
    <div className='flex flex-col lg:grid lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-border h-full bg-card overflow-y-auto scrollbar-hide'>
      {duesConfig.map((item) => (
        <div key={item.id} className='p-4 h-auto lg:h-full relative overflow-hidden min-h-[120px] shrink-0'>
          <TotalDuesItem {...item} />
        </div>
      ))}
    </div>
  );
};

export default TotalDuesWidget;
