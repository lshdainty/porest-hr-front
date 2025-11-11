import dayjs from 'dayjs';
import {
  Ban,
  Calendar,
  CheckCircle,
  FileText,
  User,
  Users,
  XCircle
} from 'lucide-react';

import { GetUserRequestedVacationsResp, usePostApproveVacation, usePostRejectVacation } from '@/api/vacation';
import { toast } from '@/components/alert/toast';
import { Badge } from '@/components/shadcn/badge';
import { Button } from '@/components/shadcn/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/shadcn/dialog';
import { ScrollArea } from '@/components/shadcn/scrollArea';
import { Separator } from '@/components/shadcn/separator';
import { Textarea } from '@/components/shadcn/textarea';
import { useLoginUserStore } from '@/store/LoginUser';
import { getStatusBadge, getStatusConfig, getStatusIcon } from '@/utils/vacationStatus';
import { useState } from 'react';

interface VacationApprovalFormProps {
  open: boolean;
  onClose: () => void;
  requestData?: GetUserRequestedVacationsResp;
  applicantName?: string;
}

export default function VacationApprovalForm({
  open,
  onClose,
  requestData,
  applicantName,
}: VacationApprovalFormProps) {
  const { loginUser } = useLoginUserStore()
  const [showRejectReason, setShowRejectReason] = useState(false)
  const [rejectReason, setRejectReason] = useState('')

  const { mutate: approveVacation } = usePostApproveVacation()
  const { mutate: rejectVacation } = usePostRejectVacation()

  const approvers = requestData?.approvers || []

  // 현재 로그인한 사용자가 현재 결재자인지 확인
  const isCurrentApprover = loginUser?.user_id === requestData?.current_approver_id

  // 현재 결재자의 approval_id 찾기
  const currentApprovalId = approvers.find(
    approver => approver.approver_id === requestData?.current_approver_id
  )?.approval_id

  // 반려 사유 찾기 (REJECTED 상태인 승인자의 반려 사유)
  const rejectionInfo = approvers.find(
    approver => approver.approval_status === 'REJECTED'
  )

  const handleApprove = () => {
    if (!currentApprovalId || !loginUser?.user_id) return

    approveVacation({
      approval_id: currentApprovalId,
      approver_id: loginUser.user_id
    }, {
      onSuccess: () => {
        onClose()
      }
    })
  }

  const handleReject = () => {
    if (!currentApprovalId || !loginUser?.user_id) return
    if (!rejectReason.trim()) {
      toast.error('반려 사유를 입력해주세요.')
      return
    }

    rejectVacation({
      approval_id: currentApprovalId,
      approver_id: loginUser.user_id,
      rejection_reason: rejectReason
    }, {
      onSuccess: () => {
        setRejectReason('')
        setShowRejectReason(false)
        onClose()
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='max-w-5xl max-h-[90vh] p-0 grid grid-rows-[auto_1fr_auto]'>
        <DialogHeader className='p-6 pb-4 border-b'>
          <DialogTitle className='text-2xl font-bold'>
            휴가 신청 상세보기
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className='flex-1'>
          <div className='p-6'>
            <div className='space-y-6'>
              {/* 메인 폼 영역 */}
              <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                {/* 좌측: 기본 정보 */}
                <div className='lg:col-span-2 space-y-6'>
                  <Card>
                    <CardHeader>
                      <CardTitle className='flex items-center gap-2'>
                        <FileText className='w-5 h-5 text-blue-600' />
                        기본 정보
                      </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                      {/* 기안자 정보 */}
                      <div className='border rounded-lg overflow-hidden'>
                        <div className='bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-2 border-b'>
                          <div className='flex items-center gap-2'>
                            <User className='w-4 h-4 text-blue-600' />
                            <h3 className='text-sm font-semibold text-blue-900'>신청자 정보</h3>
                          </div>
                        </div>
                        <table className='w-full text-sm'>
                          <tbody>
                            <tr className='border-b'>
                              <td className='bg-muted px-4 py-3 font-medium w-32'>신청자</td>
                              <td className='px-4 py-3'>
                                {applicantName || '정보 없음'}
                              </td>
                            </tr>
                            <tr>
                              <td className='bg-muted px-4 py-3 font-medium'>신청일시</td>
                              <td className='px-4 py-3'>
                                {requestData?.create_date
                                  ? dayjs(requestData.create_date).format('YYYY-MM-DD HH:mm')
                                  : '정보 없음'}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <Separator />

                      {/* 휴가 정책 정보 */}
                      <div className='border rounded-lg overflow-hidden'>
                        <div className='bg-gradient-to-r from-purple-50 to-purple-100 px-4 py-2 border-b'>
                          <div className='flex items-center gap-2'>
                            <Calendar className='w-4 h-4 text-purple-600' />
                            <h3 className='text-sm font-semibold text-purple-900'>휴가 정책 정보</h3>
                          </div>
                        </div>
                        <table className='w-full text-sm'>
                          <tbody>
                            <tr className='border-b'>
                              <td className='bg-muted px-4 py-3 font-medium w-32'>정책명</td>
                              <td className='px-4 py-3 font-medium'>
                                {requestData?.policy_name || '정보 없음'}
                              </td>
                            </tr>
                            <tr className='border-b'>
                              <td className='bg-muted px-4 py-3 font-medium'>휴가 종류</td>
                              <td className='px-4 py-3'>
                                <Badge variant='outline' className='bg-blue-50 text-blue-700'>
                                  {requestData?.vacation_type_name || '정보 없음'}
                                </Badge>
                              </td>
                            </tr>
                            <tr className='border-b'>
                              <td className='bg-muted px-4 py-3 font-medium'>부여 기준 시간</td>
                              <td className='px-4 py-3'>
                                <div className='flex items-center gap-2'>
                                  <Badge variant='outline' className='bg-green-50 text-green-700'>
                                    {requestData?.policy_grant_time_str || '정보 없음'}
                                  </Badge>
                                </div>
                              </td>
                            </tr>
                            {requestData?.grant_date && (
                              <tr className='border-b'>
                                <td className='bg-muted px-4 py-3 font-medium'>부여일</td>
                                <td className='px-4 py-3 text-foreground'>
                                  {dayjs(requestData.grant_date).format('YYYY-MM-DD')}
                                </td>
                              </tr>
                            )}
                            {requestData?.expiry_date && (
                              <tr>
                                <td className='bg-muted px-4 py-3 font-medium'>만료일</td>
                                <td className='px-4 py-3'>
                                  <span className='text-red-600 font-medium'>
                                    {dayjs(requestData.expiry_date).format('YYYY-MM-DD')}
                                  </span>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>

                      <Separator />

                      {/* 신청 상세 정보 */}
                      <div className='border rounded-lg overflow-hidden'>
                        <div className='bg-gradient-to-r from-green-50 to-green-100 px-4 py-2 border-b'>
                          <div className='flex items-center gap-2'>
                            <FileText className='w-4 h-4 text-green-600' />
                            <h3 className='text-sm font-semibold text-green-900'>신청 상세</h3>
                          </div>
                        </div>
                        <table className='w-full text-sm'>
                          <tbody>
                            <tr className='border-b'>
                              <td className='bg-muted px-4 py-3 font-medium w-32'>제목</td>
                              <td className='px-4 py-3 font-medium'>
                                {requestData?.desc || '정보 없음'}
                              </td>
                            </tr>
                            <tr className='border-b'>
                              <td className='bg-muted px-4 py-3 font-medium'>대상 일자</td>
                              <td className='px-4 py-3'>
                                {requestData?.request_start_time && requestData?.request_end_time ? (
                                  <div className='space-y-1'>
                                    <div className='font-medium'>
                                      {dayjs(requestData.request_start_time).format('YYYY-MM-DD HH:mm')}
                                      {' ~ '}
                                      {dayjs(requestData.request_end_time).format('YYYY-MM-DD HH:mm')}
                                    </div>
                                    <div className='flex items-center gap-2 mt-2'>
                                      <Badge className='bg-blue-100 text-blue-800 border-blue-300 border'>
                                        총 {requestData.grant_time_str}
                                      </Badge>
                                    </div>
                                  </div>
                                ) : requestData?.request_start_time ? (
                                  <div className='space-y-1'>
                                    <div className='font-medium'>
                                      {dayjs(requestData.request_start_time).format('YYYY-MM-DD HH:mm')}
                                    </div>
                                    <Badge className='bg-blue-100 text-blue-800 border-blue-300 border mt-2'>
                                      총 {requestData.grant_time_str}
                                    </Badge>
                                  </div>
                                ) : (
                                  '정보 없음'
                                )}
                              </td>
                            </tr>
                            <tr className='border-b'>
                              <td className='bg-muted px-4 py-3 font-medium'>현재 상태</td>
                              <td className='px-4 py-3'>
                                <div className='flex items-center gap-2'>
                                  {(() => {
                                    const statusConfig = getStatusConfig(requestData?.grant_status || '');
                                    const StatusIcon = statusConfig?.icon;
                                    return (
                                      <Badge variant='outline' className={`${statusConfig?.color || ''} border`}>
                                        {StatusIcon && <StatusIcon className='w-3 h-3 mr-1' />}
                                        {requestData?.grant_status_name || '정보 없음'}
                                      </Badge>
                                    );
                                  })()}
                                  {requestData?.current_approver_name && (
                                    <span className='text-xs text-foreground/70'>
                                      현재 결재자: <span className='font-medium'>{requestData.current_approver_name}</span>
                                    </span>
                                  )}
                                </div>
                              </td>
                            </tr>
                            <tr className={rejectionInfo?.rejection_reason ? 'border-b' : ''}>
                              <td className='bg-muted px-4 py-3 font-medium align-top'>신청 사유</td>
                              <td className='px-4 py-3'>
                                <div className='whitespace-pre-wrap text-foreground'>
                                  {requestData?.request_desc || '-'}
                                </div>
                              </td>
                            </tr>
                            {rejectionInfo?.rejection_reason && (
                              <tr>
                                <td className='bg-muted px-4 py-3 font-medium align-top'>반려 사유</td>
                                <td className='px-4 py-3'>
                                  <div className='whitespace-pre-wrap text-red-600 font-medium'>
                                    {rejectionInfo.rejection_reason}
                                  </div>
                                  {rejectionInfo.approval_date && (
                                    <p className='text-xs text-foreground/70 mt-2'>
                                      반려일: {dayjs(rejectionInfo.approval_date).format('YYYY-MM-DD HH:mm')}
                                      {' '}
                                      (반려자: {rejectionInfo.approver_name})
                                    </p>
                                  )}
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* 우측: 결재선 */}
                <div className='lg:col-span-1'>
                  <Card className='sticky top-0'>
                    <CardHeader>
                      <CardTitle className='flex items-center gap-2'>
                        <Users className='w-5 h-5 text-purple-600' />
                        결재선
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {requestData?.grant_status === 'CANCELED' ? (
                        <div className='border rounded-lg overflow-hidden p-8'>
                          <div className='flex flex-col items-center gap-4'>
                            <div className='w-16 h-16 rounded-lg bg-muted flex items-center justify-center'>
                              <Ban className='w-10 h-10 text-foreground' />
                            </div>
                            <div className='text-center'>
                              <p className='text-lg font-semibold text-foreground mb-1'>신청 취소됨</p>
                              <p className='text-sm text-foreground/70'>결재 승인이 필요하지 않습니다</p>
                            </div>
                          </div>
                        </div>
                      ) : approvers.length > 0 ? (
                        <div className='border rounded-lg overflow-hidden'>
                          <table className='w-full table-fixed'>
                            <thead>
                              <tr>
                                {approvers.map((approver, index) => (
                                  <th
                                    key={`header-${approver.approval_id}`}
                                    className='bg-muted px-2 py-2 text-xs font-medium border-r last:border-r-0'
                                  >
                                    {approvers.length > 1 ? `${index + 1}차 승인` : '승인'}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                {approvers.map((approver) => (
                                  <td
                                    key={approver.approval_id}
                                    className='border-r last:border-r-0 p-3'
                                  >
                                    <div className='flex flex-col items-center gap-2 min-h-[100px] justify-center'>
                                      {approver.approval_status === 'APPROVED' || approver.approval_status === 'REJECTED' ? (
                                        <>
                                          {getStatusIcon(approver.approval_status)}
                                          {approver.approval_date && (
                                            <p className='text-xs text-foreground/70'>
                                              {dayjs(approver.approval_date).format('YYYY/MM/DD')}
                                            </p>
                                          )}
                                        </>
                                      ) : (
                                        <div className='h-8 w-8' />
                                      )}
                                      <p className='text-xs font-medium mt-1 text-center break-all'>
                                        {approver.approver_name}
                                      </p>
                                      {getStatusBadge(approver.approval_status, approver.approval_status_name)}
                                    </div>
                                  </td>
                                ))}
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className='text-sm text-foreground/70 text-center py-4'>결재자 정보가 없습니다.</p>
                      )}
                    </CardContent>
                  </Card>

                  {/* 결재 처리 카드 */}
                  {isCurrentApprover && (requestData?.grant_status === 'PROGRESS' || requestData?.grant_status === 'PENDING') && (
                    <Card className='mt-6'>
                      <CardHeader>
                        <CardTitle className='flex items-center gap-2'>
                          <CheckCircle className='w-5 h-5 text-green-600' />
                          결재 처리
                        </CardTitle>
                      </CardHeader>
                      <CardContent className='space-y-4'>
                        {showRejectReason ? (
                          <div className='space-y-4'>
                            <div>
                              <label className='text-sm font-medium mb-2 block'>
                                반려 사유 <span className='text-red-500'>*</span>
                              </label>
                              <Textarea
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                placeholder='반려 사유를 입력해주세요...'
                                rows={4}
                                className='resize-none'
                              />
                            </div>
                            <div className='flex gap-2'>
                              <Button
                                variant='outline'
                                onClick={() => {
                                  setShowRejectReason(false)
                                  setRejectReason('')
                                }}
                                className='flex-1'
                              >
                                취소
                              </Button>
                              <Button
                                variant='destructive'
                                onClick={handleReject}
                                className='flex-1'
                              >
                                <XCircle className='w-4 h-4 mr-2' />
                                반려 확정
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className='flex gap-2'>
                            <Button
                              onClick={() => setShowRejectReason(true)}
                              className='flex-1 bg-red-600 hover:bg-red-700 text-white'
                            >
                              <XCircle className='w-4 h-4 mr-2' />
                              반려
                            </Button>
                            <Button
                              onClick={handleApprove}
                              className='flex-1 bg-green-600 hover:bg-green-700 text-white'
                            >
                              <CheckCircle className='w-4 h-4 mr-2' />
                              승인
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* 하단 버튼 */}
        <div className='p-6 pt-4 border-t bg-muted/50'>
          <div className='flex justify-end gap-3'>
            <Button variant='outline' onClick={onClose} type='button'>
              닫기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
