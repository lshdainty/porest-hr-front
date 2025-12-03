import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select';
import UserInfoContent from '@/features/user/components/UserInfoContent';
import { GetUsersResp } from '@/lib/api/user';
import { useTranslation } from 'react-i18next';

interface UserInfoCardProps {
  title?: string;
  value: GetUsersResp[];
  selectedUserId?: string;
  onUserChange?: (userId: string) => void;
}

const UserInfoCard = ({
  title,
  value: users,
  selectedUserId,
  onUserChange,
}: UserInfoCardProps) => {
  const { t } = useTranslation('user');
  const displayTitle = title || t('info.title');
  const isSingleUser = users.length === 1;
  const selectedUser = isSingleUser
    ? users[0]
    : users.find(user => user.user_id === selectedUserId);

  if (!selectedUser) {
    return <div>{t('info.notFound')}</div>;
  }

  return (
    <div className='flex flex-col gap-6 h-full'>
      <Card className='h-full min-w-[350px]'>
        <CardHeader className='pb-4 flex flex-row items-center justify-between'>
          <CardTitle>{displayTitle}</CardTitle>
          {!isSingleUser && onUserChange && (
            <Select onValueChange={onUserChange} value={selectedUserId}>
              <SelectTrigger className='w-[150px]'>
                <SelectValue placeholder={t('info.selectPlaceholder')} />
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
        <CardContent className='p-0'>
          <UserInfoContent user={selectedUser} />
        </CardContent>
      </Card>
    </div>
  )
}

export default UserInfoCard