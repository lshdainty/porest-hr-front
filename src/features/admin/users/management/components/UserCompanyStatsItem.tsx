import BigxdataLogo from '@/assets/img/bigxdata.svg';
import CnthothLogo from '@/assets/img/cnthoth.svg';
import DtolLogo from '@/assets/img/dtol.svg';
import InsightonLogo from '@/assets/img/insighton.svg';
import SkaxLogo from '@/assets/img/skax.svg';
import { GetUsersResp } from '@/lib/api/user';

export interface UserCompanyStatsItemProps {
  id: string;
  name: string;
  count: number;
  logo: string;
}

const UserCompanyStatsItem = ({ name, count, logo }: UserCompanyStatsItemProps) => {
  return (
    <div className='flex flex-col h-full justify-between'>
      <div className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <h3 className='text-sm font-medium text-muted-foreground'>{name}</h3>
        <img src={logo} alt={`${name} logo`} className='w-8 h-8' />
      </div>
      <div>
        <div className='text-2xl font-bold'>{count}</div>
        <p className='text-xs text-muted-foreground'>총 인원</p>
      </div>
    </div>
  );
};

export const getUserCompanyStatsConfig = (users: GetUsersResp[] = []): UserCompanyStatsItemProps[] => {
  const counts: { [key: string]: number } = {};

  users.forEach((user: GetUsersResp) => {
    (counts[user.user_origin_company_name]) ? counts[user.user_origin_company_name]++ : counts[user.user_origin_company_name] = 1;
  });

  const logoMap: { [key: string]: string } = {
    'SK AX': SkaxLogo,
    '디투엘': DtolLogo,
    '인사이트온': InsightonLogo,
    '씨앤토트플러스': CnthothLogo,
    'BigxData': BigxdataLogo,
  };

  return Object.keys(counts).map(companyName => ({
    id: companyName,
    name: companyName,
    count: counts[companyName],
    logo: logoMap[companyName]
  }));
};

export default UserCompanyStatsItem;
