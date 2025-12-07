import { Card, CardContent } from '@/components/shadcn/card';
import { GetUserRequestedVacationStatsResp } from '@/lib/api/vacation';
import { useTranslation } from 'react-i18next';

import VacationRequestStatsItem, { getVacationRequestStatsConfig } from './VacationRequestStatsItem';

interface VacationRequestStatsCardsProps {
  stats: GetUserRequestedVacationStatsResp | undefined;
}

const VacationRequestStatsCards = ({ stats }: VacationRequestStatsCardsProps) => {
  const { t } = useTranslation('vacation');
  const cardConfig = getVacationRequestStatsConfig(stats, t);

  return (
    <div className='flex flex-wrap gap-4 mb-8'>
      {cardConfig.map((card) => (
        <Card key={card.id} className='relative overflow-hidden py-0 min-w-[140px] flex-1'>
          <CardContent className='p-6'>
            <VacationRequestStatsItem {...card} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default VacationRequestStatsCards;
