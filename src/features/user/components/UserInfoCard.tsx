import { GetUsersResp } from '@/lib/api/user';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select';
import { Separator } from '@/components/shadcn/separator';
import config from '@/config/config';
import { cn } from '@/lib/utils';
import { Briefcase, Building2, Cake, Clock, Mail, Shield, User as UserIcon, UserRound, UserRoundCog } from 'lucide-react';

interface UserInfoCardProps {
  title?: string;
  value: GetUsersResp[];
  selectedUserId?: string;
  onUserChange?: (userId: string) => void;
}

const UserInfoCard = ({
  title = '사용자 정보',
  value: users,
  selectedUserId,
  onUserChange,
}: UserInfoCardProps) => {
  const isSingleUser = users.length === 1;
  const selectedUser = isSingleUser 
    ? users[0] 
    : users.find(user => user.user_id === selectedUserId);

  if (!selectedUser) {
    return <div>사용자를 찾을 수 없습니다.</div>;
  }

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
    <div className='flex flex-col gap-6 h-full'>
      <Card className='h-full min-w-[350px]'>
        <CardHeader className='pb-4 flex flex-row items-center justify-between'>
          <CardTitle>{title}</CardTitle>
          {!isSingleUser && onUserChange && (
            <Select onValueChange={onUserChange} value={selectedUserId}>
              <SelectTrigger className='w-[150px]'>
                <SelectValue placeholder='사용자 선택' />
              </SelectTrigger>
              <SelectContent>
                {users.map(user => (
                  <SelectItem key={user.user_id} value={user.user_id}>
                    {user.user_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </CardHeader>
        <CardContent className='flex flex-col items-center text-center p-6'>
          <Avatar className='w-32 h-32 mb-4'>
            <AvatarImage src={`${config.baseUrl}${selectedUser.profile_url}`} alt={selectedUser.user_name} />
            <AvatarFallback>{selectedUser.user_name.charAt(0)}</AvatarFallback>
          </Avatar>
          <p className='text-2xl font-bold'>{selectedUser.user_name}</p>
          <p className='text-sm text-muted-foreground'>
            {selectedUser.user_origin_company_name}
            {selectedUser.main_department_name_kr && ` / ${selectedUser.main_department_name_kr}`}
          </p>
          <Separator className='my-6' />
          <div className='w-full text-left space-y-5 text-sm'>
            <div className='flex items-center'>
              <UserIcon className='mr-3 h-4 w-4 text-muted-foreground' />
              <span className='font-semibold w-24'>아이디</span>
              <span>{selectedUser.user_id}</span>
            </div>
            <div className='flex items-center'>
              <Mail className='mr-3 h-4 w-4 text-muted-foreground' />
              <span className='font-semibold w-24'>이메일</span>
              <span>{selectedUser.user_email}</span>
            </div>
            <div className='flex items-center'>
              <Cake className='mr-3 h-4 w-4 text-muted-foreground' />
              <span className='font-semibold w-24'>생년월일</span>
              <span>
                {selectedUser.user_birth ?
                  `${selectedUser.user_birth.split('-')[0]}년 ${selectedUser.user_birth.split('-')[1]}월 ${selectedUser.user_birth.split('-')[2]}일` :
                  '-'
                }
              </span>
            </div>
            <div className='flex items-center'>
              <Building2 className='mr-3 h-4 w-4 text-muted-foreground' />
              <span className='font-semibold w-24'>회사</span>
              <span>{selectedUser.user_origin_company_name}</span>
            </div>
            <div className='flex items-center'>
              <Briefcase className='mr-3 h-4 w-4 text-muted-foreground' />
              <span className='font-semibold w-24'>부서</span>
              <span>{selectedUser.main_department_name_kr || '-'}</span>
            </div>
            <div className='flex items-center'>
              <Clock className='mr-3 h-4 w-4 text-muted-foreground' />
              <span className='font-semibold w-24'>유연근무시간</span>
              <span>{formatWorkTime(selectedUser.user_work_time)}</span>
            </div>
            <div className='flex items-center'>
              <Shield className='mr-3 h-4 w-4 text-muted-foreground' />
              <span className='font-semibold w-24'>권한</span>
              <div className={cn(
                'flex flex-row items-center text-sm font-semibold gap-1',
                {
                  'text-rose-500 dark:text-rose-400': selectedUser.user_role_type === 'ADMIN',
                  'text-sky-500 dark:text-sky-400': selectedUser.user_role_type === 'USER'
                }
              )}>
                {selectedUser.user_role_type === 'ADMIN' ? 
                  <UserRoundCog size={16}/> : 
                  <UserRound size={16}/>
                }
                {selectedUser.user_role_type}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default UserInfoCard