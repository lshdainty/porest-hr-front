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
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border h-full'>
      {duesConfig.map((item) => (
        <div key={item.id} className='p-6 bg-card h-full relative overflow-hidden'>
          <TotalDuesItem {...item} />
        </div>
      ))}
    </div>
  );
};

export default TotalDuesWidget;
