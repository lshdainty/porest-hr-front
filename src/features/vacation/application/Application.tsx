import { useState } from 'react'
import { useGetUserApprovers } from '@/api/user'
import { useGetUserVacationPolicies } from '@/api/vacation'
import { useLoginUserStore } from '@/store/LoginUser'
import ApplicationTable from '@/features/vacation/application/ApplicationTable'
import ApplicationFormDialog from '@/features/vacation/application/ApplicationForm'

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

  return (
    <div className='p-4 sm:p-6 md:p-8'>
      <ApplicationTable onCreateNew={handleCreateNew} />
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
