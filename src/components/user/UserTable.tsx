import { useGetOriginCompanyTypes } from '@/api/type';
import { useDeleteUser, usePutUser, type GetUsersResp, type PutUserReq } from '@/api/user';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/avatar';
import { Badge } from '@/components/shadcn/badge';
import { Button } from '@/components/shadcn/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/shadcn/dropdownMenu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shadcn/table';
import ResendEmailDialog from '@/components/user/ResendEmailDialog';
import UserDeleteDialog from '@/components/user/UserDeleteDialog';
import UserEditDialog from '@/components/user/UserEditDialog';
import UserInviteDialog from '@/components/user/UserInviteDialog';
import config from '@/config/config';
import { cn } from '@/lib/utils';
import { Empty } from 'antd';
import dayjs from 'dayjs';
import { EllipsisVertical, MailPlus, Pencil, Trash2, UserRound, UserRoundCog } from 'lucide-react';
import { useState } from 'react';

interface UserTableProps {
  value: GetUsersResp[];
}

export default function UserTable({ value: users }: UserTableProps) {
  const { mutate: putUser } = usePutUser();
  const { mutate: deleteUser } = useDeleteUser();
  const { data: companyTypes } = useGetOriginCompanyTypes();

  // Dialog 상태 관리
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState<string | null>(null);
  const [showResendDialog, setShowResendDialog] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState<string | null>(null);
  const [showInviteEditDialog, setShowInviteEditDialog] = useState<string | null>(null);

  const handleUpdateUser = (user: PutUserReq) => {
    putUser({
      user_id: user.user_id,
      user_name: user.user_name,
      user_email: user.user_email,
      user_birth: dayjs(user.user_birth).format('YYYYMMDD'),
      user_origin_company_type: user.user_origin_company_type,
      user_department_type: user.user_department_type,
      user_work_time: user.user_work_time,
      user_role_type: user.user_role_type,
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
            <Button className='text-sm h-8' size='sm' onClick={() => setShowInviteDialog(true)}>
              초대
            </Button>
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
                            <DropdownMenuItem
                              disabled={row.invitation_status !== 'EXPIRED' && row.invitation_status !== 'INACTIVE'}
                              onSelect={() => setShowResendDialog(row.user_id)}
                            >
                              <MailPlus className='h-4 w-4' />
                              <span>메일 재전송</span>
                            </DropdownMenuItem>
                            {row.invitation_status === 'ACTIVE' && (
                              <DropdownMenuItem
                                onSelect={() => setShowEditDialog(row.user_id)}
                              >
                                <Pencil className='h-4 w-4' />
                                <span>수정</span>
                              </DropdownMenuItem>
                            )}
                            {row.invitation_status === 'PENDING' && (
                              <DropdownMenuItem
                                onSelect={() => setShowInviteEditDialog(row.user_id)}
                              >
                                <Pencil className='h-4 w-4' />
                                <span>수정</span>
                              </DropdownMenuItem>
                            )}
                            {row.invitation_status !== 'ACTIVE' && row.invitation_status !== 'PENDING' && (
                              <DropdownMenuItem
                                disabled
                              >
                                <Pencil className='h-4 w-4' />
                                <span>수정</span>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onSelect={() => setShowDeleteDialog(row.user_id)}
                              className='text-destructive focus:text-destructive hover:!bg-destructive/20'
                            >
                              <Trash2 className='h-4 w-4' />
                              <span>삭제</span>
                            </DropdownMenuItem>
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

      {/* 사용자 초대 Dialog */}
      <UserInviteDialog
        open={showInviteDialog}
        onOpenChange={setShowInviteDialog}
        title='사용자 초대'
        companyOptions={companyTypes || []}
      />

      {/* 각 행별 Dialog들 */}
      {users.map((row) => (
        <div key={row.user_id}>
          {/* 메일 재전송 Dialog */}
          <ResendEmailDialog
            open={showResendDialog === row.user_id}
            onOpenChange={(open) => setShowResendDialog(open ? row.user_id : null)}
            userId={row.user_id}
            userEmail={row.user_email}
          />

          {/* ACTIVE 상태 수정 Dialog */}
          {row.invitation_status === 'ACTIVE' && (
            <UserEditDialog
              open={showEditDialog === row.user_id}
              onOpenChange={(open) => setShowEditDialog(open ? row.user_id : null)}
              user={row}
              onSave={handleUpdateUser}
            />
          )}

          {/* PENDING 상태 수정 Dialog */}
          {row.invitation_status === 'PENDING' && (
            <UserInviteDialog
              open={showInviteEditDialog === row.user_id}
              onOpenChange={(open) => setShowInviteEditDialog(open ? row.user_id : null)}
              title='사용자 정보 수정'
              companyOptions={companyTypes || []}
              initialData={{
                user_id: row.user_id,
                user_name: row.user_name,
                user_email: row.user_email,
                user_origin_company_type: row.user_origin_company_type,
                user_work_time: row.user_work_time,
                join_date: row.join_date
              }}
            />
          )}

          {/* 삭제 Dialog */}
          <UserDeleteDialog
            open={showDeleteDialog === row.user_id}
            onOpenChange={(open) => setShowDeleteDialog(open ? row.user_id : null)}
            user={row}
            onDelete={handleDeleteUser}
          />
        </div>
      ))}
    </Card>
  )
}