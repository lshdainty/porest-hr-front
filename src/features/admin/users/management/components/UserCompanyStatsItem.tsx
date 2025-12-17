import BigxdataLogo from '@/assets/img/bigxdata.svg';
import BusinessinsightLogo from '@/assets/img/businessinsight.svg';
import CnthothLogo from '@/assets/img/cnthoth.svg';
import DtolLogo from '@/assets/img/dtol.svg';
import InsightonLogo from '@/assets/img/insighton.svg';
import SkaxLogo from '@/assets/img/skax.svg';
import { GetUsersResp } from '@/lib/api/user';
import { useTranslation } from 'react-i18next';

export interface UserCompanyStatsItemProps {
  id: string;
  name: string;
  count: number;
  logo: string;
}

const UserCompanyStatsItem = ({ name, count, logo }: UserCompanyStatsItemProps) => {
  const { t } = useTranslation('admin');

  return (
    <div className='flex flex-col h-full justify-between'>
      <div className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <h3 className='text-sm font-medium text-muted-foreground'>{name}</h3>
        <img src={logo} alt={`${name} logo`} className='w-8 h-8' />
      </div>
      <div>
        <div className='text-2xl font-bold'>{count}</div>
        <p className='text-xs text-muted-foreground'>{t('user.totalCount')}</p>
      </div>
    </div>
  );
};

export const getUserCompanyStatsConfig = (users: GetUsersResp[] = []): UserCompanyStatsItemProps[] => {
  const counts: { [key: string]: { count: number; name: string } } = {};

  users.forEach((user: GetUsersResp) => {
    const type = user.user_company_type;
    if (counts[type]) {
      counts[type].count++;
    } else {
      counts[type] = { count: 1, name: user.user_origin_company_name };
    }
  });

  // enum 코드 기반 로고 매핑 (언어 변경에 영향받지 않음)
  const logoMap: { [key: string]: string } = {
    'SKAX': SkaxLogo,
    'DTOL': DtolLogo,
    'INSIGHTON': InsightonLogo,
    'CNTHOTH': CnthothLogo,
    'BIGXDATA': BigxdataLogo,
    'BUSINESSINSIGHT': BusinessinsightLogo,
  };

  return Object.keys(counts).map(companyType => ({
    id: companyType,
    name: counts[companyType].name,
    count: counts[companyType].count,
    logo: logoMap[companyType]
  }));
};

export { UserCompanyStatsItem };
