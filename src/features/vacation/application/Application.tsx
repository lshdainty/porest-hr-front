import { useUserApproversQuery } from '@/hooks/queries/useUsers'
import { useGrantStatusTypesQuery } from '@/hooks/queries/useTypes'
import { useUserVacationPoliciesQuery, useUserRequestedVacationsQuery, useUserRequestedVacationStatsQuery } from '@/hooks/queries/useVacations'
import ApplicationFormDialog from '@/components/application/ApplicationForm'
import ApplicationTable from '@/components/application/ApplicationTable'
import ApplicationTableSkeleton from '@/components/application/ApplicationTableSkeleton'
import VacationRequestStatsCards from '@/components/application/VacationRequestStatsCards'
import VacationRequestStatsCardsSkeleton from '@/components/application/VacationRequestStatsCardsSkeleton'
import { Button } from '@/components/shadcn/button'
import { useUser } from '@/contexts/UserContext'
import { Plus } from 'lucide-react'
import { useState } from 'react'

export default function Application() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { loginUser } = useUser()

  const { data: vacationPolicies = [] } = useUserVacationPoliciesQuery(
    loginUser?.user_id || '',
    'ON_REQUEST'
  )

  const { data: approvers = [] } = useUserApproversQuery(loginUser?.user_id || '')

  const { data: vacationRequests = [], isLoading: isLoadingRequests } = useUserRequestedVacationsQuery(
    loginUser?.user_id || ''
  )

  const { data: grantStatusTypes = [] } = useGrantStatusTypesQuery()

  const { data: stats, isLoading: isLoadingStats } = useUserRequestedVacationStatsQuery(
    loginUser?.user_id || ''
  )

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
