import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/shadcn/avatar';
import { Separator } from '@/shared/ui/shadcn/separator';
import { config } from '@/shared/config'
import { GetUsersResp } from '@/entities/user';
import { Briefcase, Building2, Cake, Clock, Mail, User as UserIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface UserInfoContentProps {
  user: GetUsersResp;
}

const UserInfoContent = ({ user }: UserInfoContentProps) => {
  const { t } = useTranslation('user');

  const formatWorkTime = (time: string | undefined): string => {
    if (!time) {
      return '';
    }
    const parts = time.split(' ~ ');
    if (parts.length !== 2) {
      return time;
    }
    const [start, end] = parts.map(p => p.trim());
    const formattedStart = `${start.padStart(2, '0')}:00`;
    const endHour = parseInt(end, 10);
    const formattedEndHour = endHour < 12 ? endHour + 12 : endHour;
    const formattedEnd = `${formattedEndHour}:00`;

    return `${formattedStart} ~ ${formattedEnd}`;
  };

  const formatBirthDate = (birth: string | undefined): string => {
    if (!birth) return '-';
    const parts = birth.split('-');
    if (parts.length !== 3) return birth;
    return t('info.birthFormat', { year: parts[0], month: parts[1], day: parts[2] });
  };

  return (
    <div className='flex flex-col items-center text-center p-6'>
      <Avatar className='w-32 h-32 mb-4'>
        <AvatarImage src={`${config.baseUrl}${user.profile_url}`} alt={user.user_name} />
        <AvatarFallback>{user.user_name.charAt(0)}</AvatarFallback>
      </Avatar>
      <p className='text-2xl font-bold'>{user.user_name}</p>
      <p className='text-sm text-muted-foreground'>
        {user.user_origin_company_name}
        {user.main_department_name_kr && ` / ${user.main_department_name_kr}`}
      </p>
      <Separator className='my-6' />
      <div className='w-full text-left space-y-5 text-sm'>
        <div className='flex items-center'>
          <UserIcon className='mr-3 h-4 w-4 text-muted-foreground' />
          <span className='font-semibold w-24'>{t('info.userId')}</span>
          <span>{user.user_id}</span>
        </div>
        <div className='flex items-center'>
          <Mail className='mr-3 h-4 w-4 text-muted-foreground' />
          <span className='font-semibold w-24'>{t('info.email')}</span>
          <span>{user.user_email}</span>
        </div>
        <div className='flex items-center'>
          <Cake className='mr-3 h-4 w-4 text-muted-foreground' />
          <span className='font-semibold w-24'>{t('info.birthDate')}</span>
          <span>{formatBirthDate(user.user_birth)}</span>
        </div>
        <div className='flex items-center'>
          <Building2 className='mr-3 h-4 w-4 text-muted-foreground' />
          <span className='font-semibold w-24'>{t('info.company')}</span>
          <span>{user.user_origin_company_name}</span>
        </div>
        <div className='flex items-center'>
          <Briefcase className='mr-3 h-4 w-4 text-muted-foreground' />
          <span className='font-semibold w-24'>{t('info.department')}</span>
          <span>{user.main_department_name_kr || '-'}</span>
        </div>
        <div className='flex items-center'>
          <Clock className='mr-3 h-4 w-4 text-muted-foreground' />
          <span className='font-semibold w-24'>{t('info.workTime')}</span>
          <span>{formatWorkTime(user.user_work_time)}</span>
        </div>

      </div>
    </div>
  );
};

export { UserInfoContent };
