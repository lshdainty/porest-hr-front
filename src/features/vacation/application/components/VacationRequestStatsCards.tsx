import { Card, CardContent } from '@/components/shadcn/card';
import { GetUserRequestedVacationStatsResp } from '@/lib/api/vacation';

import VacationRequestStatsItem, { getVacationRequestStatsConfig } from './VacationRequestStatsItem';

interface VacationRequestStatsCardsProps {
  stats: GetUserRequestedVacationStatsResp | undefined;
}

const VacationRequestStatsCards = ({ stats }: VacationRequestStatsCardsProps) => {
  const cardConfig = getVacationRequestStatsConfig(stats);

  return (
    <div className='grid grid-cols-2 lg:grid-cols-7 gap-4 mb-8'>
      {cardConfig.map((card) => (
        <Card key={card.id} className='relative overflow-hidden py-0'>
          <CardContent className='p-6'>
            <VacationRequestStatsItem {...card} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default VacationRequestStatsCards;
