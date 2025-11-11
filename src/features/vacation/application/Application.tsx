import { useGetUserApprovers } from '@/api/user'
import { useGetGrantStatusTypes } from '@/api/type'
import { useGetUserVacationPolicies, useGetUserRequestedVacations, useGetUserRequestedVacationStats } from '@/api/vacation'
import ApplicationFormDialog from '@/components/application/ApplicationForm'
import ApplicationTable from '@/components/application/ApplicationTable'
import ApplicationTableSkeleton from '@/components/application/ApplicationTableSkeleton'
import VacationRequestStatsCards from '@/components/application/VacationRequestStatsCards'
import VacationRequestStatsCardsSkeleton from '@/components/application/VacationRequestStatsCardsSkeleton'
import { Button } from '@/components/shadcn/button'
import { useLoginUserStore } from '@/store/LoginUser'
import { Plus } from 'lucide-react'
import { useState } from 'react'

export default function Application() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { loginUser } = useLoginUserStore()

  const { data: vacationPolicies = [] } = useGetUserVacationPolicies({
    user_id: loginUser?.user_id || '',
    grant_method: 'ON_REQUEST'
  })

  const { data: approvers = [] } = useGetUserApprovers({
    user_id: loginUser?.user_id || ''
  })

  const { data: vacationRequests = [], isLoading: isLoadingRequests } = useGetUserRequestedVacations({
    user_id: loginUser?.user_id || ''
  })

  const { data: grantStatusTypes = [] } = useGetGrantStatusTypes()

  const { data: stats, isLoading: isLoadingStats } = useGetUserRequestedVacationStats({
    user_id: loginUser?.user_id || ''
  })

  const handleCreateNew = () => {
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
  }

  const handleSubmitSuccess = () => {
    setIsDialogOpen(false)
    // 여기에 데이터 새로고침 로직 추가 가능
  }

  if (isLoadingRequests || isLoadingStats) {
    return (
      <div className='p-4 sm:p-6 md:p-8'>
        <h1 className='text-3xl font-bold mb-2'>휴가 신청 관리</h1>
        <p className='text-foreground/70 mb-8'>휴가를 신청하고 현황을 관리하세요</p>
        <VacationRequestStatsCardsSkeleton />
        <ApplicationTableSkeleton />
      </div>
    )
  }

  return (
    <div className='p-4 sm:p-6 md:p-8'>
      {/* 헤더 */}
      <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8'>
        <div>
          <h1 className='text-3xl font-bold mb-2'>휴가 신청 관리</h1>
          <p className='text-foreground/70'>휴가를 신청하고 현황을 관리하세요</p>
        </div>
        <Button onClick={handleCreateNew} className='flex items-center gap-2 mt-4 lg:mt-0'>
          <Plus className='w-4 h-4' />
          새 신청서 작성
        </Button>
      </div>

      {/* 통계 카드 */}
      <VacationRequestStatsCards stats={stats} />

      {/* 신청 내역 테이블 */}
      <ApplicationTable
        vacationRequests={vacationRequests}
        grantStatusTypes={grantStatusTypes}
        userId={loginUser?.user_id || ''}
        userName={loginUser?.user_name}
      />

      {/* 신청서 작성 다이얼로그 */}
      <ApplicationFormDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onSubmitSuccess={handleSubmitSuccess}
        vacationPolicies={vacationPolicies}
        approvers={approvers}
      />
    </div>
  )
}
