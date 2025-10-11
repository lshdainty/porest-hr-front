import { useMemo } from 'react';
import { GetUsersResp } from '@/api/user';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/shadcn/card';
import SkaxLogo from '@/assets/img/skax.svg';
import DtolLogo from '@/assets/img/dtol.svg';
import InsightonLogo from '@/assets/img/insighton.svg';
import CnthothLogo from '@/assets/img/cnthoth.svg';
import BigxdataLogo from '@/assets/img/bigxdata.svg';

interface UserCompanyCardProps {
  value: GetUsersResp[];
}

export default function UserCompanyCard({ value: users }: UserCompanyCardProps) {
  const companys = useMemo(() => {
    if (!users) return [];

    const counts: { [key: string]: number } = {};

    users.forEach((user: GetUsersResp) => {
      (counts[user.user_origin_company_name]) ? counts[user.user_origin_company_name]++ : counts[user.user_origin_company_name] = 1;
    });

    return Object.keys(counts).map(companyName => ({
      name: companyName,
      count: counts[companyName]
    }));
  }, [users]);

  const logoMap: { [key: string]: string } = {
    'SK AX': SkaxLogo,
    '디투엘': DtolLogo,
    '인사이트온': InsightonLogo,
    '씨앤토트플러스': CnthothLogo,
    'BigxData': BigxdataLogo,
  };

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-6'>
      {companys.map((company) => (
        <Card key={company.name}>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>{company.name}</CardTitle>
            <img src={logoMap[company.name]} alt={`${company.name} logo`} className='w-8 h-8' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{company.count}</div>
            <p className='text-xs text-muted-foreground'>총 인원</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}