import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select';
import UserInfoContent from '@/features/user/components/UserInfoContent';
import { GetUsersResp } from '@/lib/api/user';

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
        <CardContent className='p-0'>
          <UserInfoContent user={selectedUser} />
        </CardContent>
      </Card>
    </div>
  )
}

export default UserInfoCard