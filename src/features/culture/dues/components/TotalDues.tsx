import { Card, CardContent } from '@/components/shadcn/card';
import { GetMonthBirthDuesResp, GetYearOperationDuesResp } from '@/lib/api/dues';
import TotalDuesItem, { getTotalDuesConfig } from './TotalDuesItem';

interface TotalDuesProps {
  totalDues?: GetYearOperationDuesResp;
  birthDues?: GetMonthBirthDuesResp;
}

const TotalDues = ({ totalDues, birthDues }: TotalDuesProps) => {
  const duesConfig = getTotalDuesConfig(totalDues, birthDues);

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
      {duesConfig.map((item) => (
        <Card key={item.id} className='relative overflow-hidden'>
          <CardContent className='h-full'>
            <TotalDuesItem {...item} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TotalDues;