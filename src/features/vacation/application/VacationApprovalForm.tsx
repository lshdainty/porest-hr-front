import dayjs from 'dayjs';
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  User,
  Users
} from 'lucide-react';

import { GetUserRequestedVacationsResp } from '@/api/vacation';
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

  const approvers = requestData?.approvers || [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className='w-8 h-8 text-green-600' />;
      case 'REJECTED':
        return <AlertCircle className='w-8 h-8 text-red-600' />;
      default:
        return <Clock className='w-8 h-8 text-yellow-600' />;
    }
  };

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
                              <td className='bg-gray-50 px-4 py-3 font-medium w-32'>신청자</td>
                              <td className='px-4 py-3'>
                                {applicantName || '정보 없음'}
                              </td>
                            </tr>
                            <tr>
                              <td className='bg-gray-50 px-4 py-3 font-medium'>신청일시</td>
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
                              <td className='bg-gray-50 px-4 py-3 font-medium w-32'>정책명</td>
                              <td className='px-4 py-3 font-medium'>
                                {requestData?.policy_name || '정보 없음'}
                              </td>
                            </tr>
                            <tr className='border-b'>
                              <td className='bg-gray-50 px-4 py-3 font-medium'>휴가 종류</td>
                              <td className='px-4 py-3'>
                                <Badge variant='outline' className='bg-blue-50 text-blue-700'>
                                  {requestData?.vacation_type_name || '정보 없음'}
                                </Badge>
                              </td>
                            </tr>
                            <tr className='border-b'>
                              <td className='bg-gray-50 px-4 py-3 font-medium'>부여 기준 시간</td>
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
                                <td className='bg-gray-50 px-4 py-3 font-medium'>부여일</td>
                                <td className='px-4 py-3 text-gray-700'>
                                  {dayjs(requestData.grant_date).format('YYYY-MM-DD')}
                                </td>
                              </tr>
                            )}
                            {requestData?.expiry_date && (
                              <tr>
                                <td className='bg-gray-50 px-4 py-3 font-medium'>만료일</td>
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
                              <td className='bg-gray-50 px-4 py-3 font-medium w-32'>제목</td>
                              <td className='px-4 py-3 font-medium'>
                                {requestData?.desc || '정보 없음'}
                              </td>
                            </tr>
                            <tr className='border-b'>
                              <td className='bg-gray-50 px-4 py-3 font-medium'>대상 일자</td>
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
                              <td className='bg-gray-50 px-4 py-3 font-medium'>현재 상태</td>
                              <td className='px-4 py-3'>
                                <div className='flex items-center gap-2'>
                                  <Badge variant='outline' className='bg-yellow-50 text-yellow-800 border-yellow-300'>
                                    {requestData?.grant_status_name || '정보 없음'}
                                  </Badge>
                                  {requestData?.current_approver_name && (
                                    <span className='text-xs text-gray-600'>
                                      현재 결재자: <span className='font-medium'>{requestData.current_approver_name}</span>
                                    </span>
                                  )}
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td className='bg-gray-50 px-4 py-3 font-medium align-top'>신청 사유</td>
                              <td className='px-4 py-3'>
                                <div className='whitespace-pre-wrap text-gray-700'>
                                  {requestData?.request_desc || '-'}
                                </div>
                              </td>
                            </tr>
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
                      {approvers.length > 0 ? (
                        <div className='border rounded-lg overflow-hidden'>
                          <table className='w-full table-fixed'>
                            <thead>
                              <tr>
                                {approvers.map((approver, index) => (
                                  <th
                                    key={`header-${approver.approval_id}`}
                                    className='bg-gray-50 px-2 py-2 text-xs font-medium border-r last:border-r-0'
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
                                      {approver.approval_status === 'APPROVED' ? (
                                        <>
                                          {getStatusIcon(approver.approval_status)}
                                          {approver.approval_date && (
                                            <p className='text-xs text-gray-500'>
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
                                      <Badge variant='outline' className='text-xs'>
                                        {approver.approval_status_name}
                                      </Badge>
                                    </div>
                                  </td>
                                ))}
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className='text-sm text-gray-500 text-center py-4'>결재자 정보가 없습니다.</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* 하단 버튼 */}
        <div className='p-6 pt-4 border-t bg-gray-50/50'>
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
