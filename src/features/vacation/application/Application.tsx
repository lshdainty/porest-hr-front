import ApplicationFormDialog from '@/components/application/ApplicationForm'
import ApplicationTable from '@/components/application/ApplicationTable'
import ApplicationTableSkeleton from '@/components/application/ApplicationTableSkeleton'
import VacationRequestStatsCards from '@/components/application/VacationRequestStatsCards'
import VacationRequestStatsCardsSkeleton from '@/components/application/VacationRequestStatsCardsSkeleton'
import QueryAsyncBoundary from '@/components/common/QueryAsyncBoundary'
import { Button } from '@/components/shadcn/button'
import { useUser } from '@/contexts/UserContext'
import { useGrantStatusTypesQuery } from '@/hooks/queries/useTypes'
import { useUserApproversQuery } from '@/hooks/queries/useUsers'
import { useUserRequestedVacationsQuery, useUserRequestedVacationStatsQuery, useUserVacationPoliciesQuery } from '@/hooks/queries/useVacations'
import { Plus } from 'lucide-react'
import { useState } from 'react'

interface ApplicationContentProps {
  vacationRequests: any[]
  grantStatusTypes: any[]
  stats: any
  vacationPolicies: any[]
  approvers: any[]
  loginUser: any
  isDialogOpen: boolean
  setIsDialogOpen: (open: boolean) => void
}

const ApplicationContent = ({
  vacationRequests,
  grantStatusTypes,
  stats,
  vacationPolicies,
  approvers,
  loginUser,
  isDialogOpen,
  setIsDialogOpen
}: ApplicationContentProps) => {
  const handleCreateNew = () => {
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
  }

  const handleSubmitSuccess = () => {
    setIsDialogOpen(false)
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
      <VacationRequestStatsCards stats={stats} />
      <ApplicationTable
        vacationRequests={vacationRequests}
        grantStatusTypes={grantStatusTypes}
        userId={loginUser?.user_id || ''}
        userName={loginUser?.user_name}
      />
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

const ApplicationSkeleton = () => {
  return (
    <div className='p-4 sm:p-6 md:p-8'>
      <h1 className='text-3xl font-bold mb-2'>휴가 신청 관리</h1>
      <p className='text-foreground/70 mb-8'>휴가를 신청하고 현황을 관리하세요</p>
      <VacationRequestStatsCardsSkeleton />
      <ApplicationTableSkeleton />
    </div>
  )
}

const Application = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { loginUser } = useUser()
  const { data: vacationPolicies = [] } = useUserVacationPoliciesQuery(
    loginUser?.user_id || '',
    'ON_REQUEST'
  )
  const { data: approvers = [] } = useUserApproversQuery(loginUser?.user_id || '')
  const { data: vacationRequests = [], isLoading: isLoadingRequests, error: requestsError } = useUserRequestedVacationsQuery(
    loginUser?.user_id || ''
  )
  const { data: grantStatusTypes = [] } = useGrantStatusTypesQuery()
  const { data: stats, isLoading: isLoadingStats, error: statsError } = useUserRequestedVacationStatsQuery(
    loginUser?.user_id || ''
  )
  const isLoading = isLoadingRequests || isLoadingStats
  const error = requestsError || statsError

  return (
    <QueryAsyncBoundary
      queryState={{ isLoading, error, data: vacationRequests }}
      loadingComponent={<ApplicationSkeleton />}
      errorComponent={
        <div className='p-4 sm:p-6 md:p-8'>
          <div className='p-8 text-center text-red-600'>
            데이터를 불러오는데 실패했습니다.
          </div>
        </div>
      }
    >
      <ApplicationContent
        vacationRequests={vacationRequests}
        grantStatusTypes={grantStatusTypes}
        stats={stats}
        vacationPolicies={vacationPolicies}
        approvers={approvers}
        loginUser={loginUser}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
      />
    </QueryAsyncBoundary>
  )
}

export default Application
