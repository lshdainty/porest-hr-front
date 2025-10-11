import UserEditDialog from '@/components/user/UserEditDialog';
import UserInviteDialog from '@/components/user/UserInviteDialog';
import UserDeleteDialog from '@/components/user/UserDeleteDialog';
import ResendEmailDialog from '@/components/user/ResendEmailDialog';
import { usePutUser, useDeleteUser, type GetUsersResp, type PutUserReq } from '@/api/user';
import { Badge } from '@/components/shadcn/badge';
import { Button } from '@/components/shadcn/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/shadcn/avatar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/shadcn/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shadcn/table';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/shadcn/dropdownMenu';
import { UserRoundCog, UserRound, EllipsisVertical, Pencil, Trash2, MailPlus } from 'lucide-react';
import { Empty } from 'antd';
import { cn } from '@/lib/utils';
import config from '@/config/config';
import dayjs from 'dayjs';

interface UserTableProps {
  value: GetUsersResp[];
}

export default function UserTable({ value: users }: UserTableProps) {
  const { mutate: putUser } = usePutUser();
  const { mutate: deleteUser } = useDeleteUser();

  const handleUpdateUser = (user: PutUserReq) => {
    putUser({
      user_id: user.user_id,
      user_name: user.user_name,
      user_email: user.user_email,
      user_birth: dayjs(user.user_birth).format('YYYYMMDD'),
      user_origin_company_type: user.user_origin_company_type,
      user_department_type: user.user_department_type,
      user_work_time: user.user_work_time,
      lunar_yn: user.lunar_yn,
      profile_url: user.profile_url,
      profile_uuid: user.profile_uuid
    });
  };

  const handleDeleteUser = (id: string) => {
    deleteUser(id);
  };

  return (
    <Card className='flex-1'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle>사용자 목록</CardTitle>
          <div className='flex gap-2'>
            <UserInviteDialog
              title='사용자 초대'
              trigger={<Button className='text-sm h-8' size='sm'>초대</Button>}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {users && users.length > 0 ? (
          <div className='overflow-x-auto relative'>
            <Table className='min-w-[1000px]'>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className={cn(
                      'min-w-[180px] w-[180px] pl-4',
                      'sticky left-0 z-5 bg-card'
                    )}
                  >
                    이름
                  </TableHead>
                  <TableHead className='min-w-[120px]'>ID</TableHead>
                  <TableHead className='min-w-[220px]'>Email</TableHead>
                  <TableHead className='min-w-[130px]'>유연근무시간</TableHead>
                  <TableHead className='min-w-[120px]'>소속 회사</TableHead>
                  <TableHead className='min-w-[100px]'>권한</TableHead>
                  <TableHead className='min-w-[120px]'>초대 상태</TableHead>
                  <TableHead className='min-w-[80px] pr-4'></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((row: GetUsersResp) => (
                  <TableRow
                    key={row.user_id}
                    className={cn(
                      'hover:bg-muted/50 hover:text-foreground',
                      'dark:hover:bg-muted/80 dark:hover:text-foreground'
                    )}
                  >
                    <TableCell 
                      className={cn(
                        'pl-4 w-[180px]',
                        'sticky left-0 z-5 bg-card'
                      )}
                    >
                      <div className='flex items-center gap-3'>
                        <Avatar className='w-8 h-8 flex-shrink-0'>
                          <AvatarImage src={`${config.baseUrl}${row.profile_url}`} alt={row.user_name} />
                          <AvatarFallback>{row.user_name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className='font-medium'>{row.user_name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{row.user_id}</TableCell>
                    <TableCell>{row.user_email}</TableCell>
                    <TableCell>
                      <Badge className={cn(
                        'text-xs whitespace-nowrap',
                        {
                          'bg-rose-500 text-white': row.user_work_time === '8 ~ 5',
                          'bg-sky-500 text-white': row.user_work_time === '9 ~ 6',
                          'bg-emerald-500 text-white': row.user_work_time === '10 ~ 7'
                        }
                      )}>
                        {row.user_work_time}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className='text-sm'>{row.user_origin_company_name}</span>
                    </TableCell>
                    <TableCell>
                      <div className={cn(
                        'flex items-center gap-1 text-sm font-semibold',
                        {
                          'text-rose-500': row.user_role_type === 'ADMIN',
                          'text-sky-500': row.user_role_type === 'USER'
                        }
                      )}>
                        {row.user_role_type === 'ADMIN' ?
                          <UserRoundCog size={14} className='flex-shrink-0'/> :
                          <UserRound size={14} className='flex-shrink-0'/>
                        }
                        <span className='whitespace-nowrap'>{row.user_role_type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn(
                        'text-xs whitespace-nowrap',
                        {
                          'bg-yellow-500 text-white': row.invitation_status === 'PENDING',
                          'bg-green-500 text-white': row.invitation_status === 'ACTIVE',
                          'bg-gray-500 text-white': row.invitation_status === 'INACTIVE',
                          'bg-red-500 text-white': row.invitation_status === 'EXPIRED'
                        }
                      )}>
                        {row.invitation_status === 'PENDING' && '가입 대기'}
                        {row.invitation_status === 'ACTIVE' && '가입 완료'}
                        {row.invitation_status === 'INACTIVE' && '비활성'}
                        {row.invitation_status === 'EXPIRED' && '토큰 만료'}
                        {!row.invitation_status && '-'}
                      </Badge>
                    </TableCell>
                    <TableCell className='pr-4'>
                      <div className='flex justify-end'>
                        <DropdownMenu modal={false}>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant='ghost'
                              size='sm'
                              className='h-8 w-8 p-0 data-[state=open]:bg-muted hover:bg-muted'
                            >
                              <EllipsisVertical className='w-4 h-4' />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end' className='w-32'>
                            <ResendEmailDialog
                              userId={row.user_id}
                              userEmail={row.user_email}
                              trigger={
                                <DropdownMenuItem
                                  disabled={row.invitation_status !== 'EXPIRED' && row.invitation_status !== 'INACTIVE'}
                                  onSelect={(e) => e.preventDefault()}
                                >
                                  <MailPlus className='h-4 w-4' />
                                  <span>메일 재전송</span>
                                </DropdownMenuItem>
                              }
                            />
                            <UserEditDialog
                              user={row}
                              onSave={handleUpdateUser}
                              trigger={
                                <DropdownMenuItem
                                  disabled={row.invitation_status !== 'ACTIVE'}
                                  onSelect={(e) => e.preventDefault()}
                                >
                                  <Pencil className='h-4 w-4' />
                                  <span>수정</span>
                                </DropdownMenuItem>
                              }
                            />
                            <DropdownMenuSeparator />
                            <UserDeleteDialog
                              user={row}
                              onDelete={handleDeleteUser}
                              trigger={
                                <DropdownMenuItem
                                  onSelect={(e) => e.preventDefault()}
                                  className='text-destructive focus:text-destructive hover:!bg-destructive/20'
                                >
                                  <Trash2 className='h-4 w-4' />
                                  <span>삭제</span>
                                </DropdownMenuItem>
                              }
                            />
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <Empty />
        )}
      </CardContent>
    </Card>
  )
}