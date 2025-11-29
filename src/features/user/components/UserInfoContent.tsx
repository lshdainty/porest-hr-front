import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/avatar';
import { Separator } from '@/components/shadcn/separator';
import config from '@/config/config';
import { GetUsersResp } from '@/lib/api/user';
import { Briefcase, Building2, Cake, Clock, Mail, User as UserIcon } from 'lucide-react';

interface UserInfoContentProps {
  user: GetUsersResp;
}

const UserInfoContent = ({ user }: UserInfoContentProps) => {
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
          <span className='font-semibold w-24'>아이디</span>
          <span>{user.user_id}</span>
        </div>
        <div className='flex items-center'>
          <Mail className='mr-3 h-4 w-4 text-muted-foreground' />
          <span className='font-semibold w-24'>이메일</span>
          <span>{user.user_email}</span>
        </div>
        <div className='flex items-center'>
          <Cake className='mr-3 h-4 w-4 text-muted-foreground' />
          <span className='font-semibold w-24'>생년월일</span>
          <span>
            {user.user_birth ?
              `${user.user_birth.split('-')[0]}년 ${user.user_birth.split('-')[1]}월 ${user.user_birth.split('-')[2]}일` :
              '-'
            }
          </span>
        </div>
        <div className='flex items-center'>
          <Building2 className='mr-3 h-4 w-4 text-muted-foreground' />
          <span className='font-semibold w-24'>회사</span>
          <span>{user.user_origin_company_name}</span>
        </div>
        <div className='flex items-center'>
          <Briefcase className='mr-3 h-4 w-4 text-muted-foreground' />
          <span className='font-semibold w-24'>부서</span>
          <span>{user.main_department_name_kr || '-'}</span>
        </div>
        <div className='flex items-center'>
          <Clock className='mr-3 h-4 w-4 text-muted-foreground' />
          <span className='font-semibold w-24'>유연근무시간</span>
          <span>{formatWorkTime(user.user_work_time)}</span>
        </div>

      </div>
    </div>
  );
};

export default UserInfoContent;
