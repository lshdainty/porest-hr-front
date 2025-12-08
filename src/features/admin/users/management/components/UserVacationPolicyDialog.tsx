import {
  useEffectiveTypesQuery,
  useExpirationTypesQuery,
  useGrantMethodTypesQuery
} from '@/hooks/queries/useTypes'
import {
  useDeleteRevokeVacationPoliciesFromUserMutation,
  useUserVacationPolicyAssignmentStatusQuery,
  usePostAssignVacationPoliciesToUserMutation
} from '@/hooks/queries/useVacations'
import { Badge } from '@/components/shadcn/badge'
import { Button } from '@/components/shadcn/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/shadcn/dialog'
import TransferList, { type TransferItem } from '@/components/shadcn/transfer'
import { Calendar, CalendarClock, Repeat } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface UserVacationPolicyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
  userName?: string
}

const UserVacationPolicyDialog = ({
  open,
  onOpenChange,
  userId,
  userName
}: UserVacationPolicyDialogProps) => {
  const { t } = useTranslation('admin')
  const { t: tc } = useTranslation('common')
  const [leftItems, setLeftItems] = useState<TransferItem[]>([])
  const [rightItems, setRightItems] = useState<TransferItem[]>([])
  const [initialLeftPolicyIds, setInitialLeftPolicyIds] = useState<Set<string>>(new Set())
  const [initialRightPolicyIds, setInitialRightPolicyIds] = useState<Set<string>>(new Set())

  // API 호출로 할당 상태 조회
  const { data: assignmentStatus, isLoading, isError } = useUserVacationPolicyAssignmentStatusQuery(userId)
  const { data: grantMethodTypes } = useGrantMethodTypesQuery()
  const { data: effectiveTypes } = useEffectiveTypesQuery()
  const { data: expirationTypes } = useExpirationTypesQuery()

  // 휴가 정책 할당/회수 API
  const assignPoliciesMutation = usePostAssignVacationPoliciesToUserMutation()
  const revokePoliciesMutation = useDeleteRevokeVacationPoliciesFromUserMutation()

  // Helper 함수: code로 displayName 찾기
  const getDisplayName = (code: string | null | undefined, types: Array<{ code: string; name: string }> | undefined) => {
    if (!code || !types) return code || '-'
    const type = types.find(t => t.code === code)
    return type ? type.name : code
  }

  // 데이터 로드 및 초기화
  useEffect(() => {
    if (!open || !assignmentStatus) return

    // 부여되지 않은 정책 (왼쪽)
    const unassignedPolicies = assignmentStatus.unassigned_policies || []
    // 부여된 정책 (오른쪽)
    const assignedPolicies = assignmentStatus.assigned_policies || []

    const newLeftPolicyIds = new Set(unassignedPolicies.map(p => String(p.vacation_policy_id)))
    const newRightPolicyIds = new Set(assignedPolicies.map(p => String(p.vacation_policy_id)))

    setInitialLeftPolicyIds(newLeftPolicyIds)
    setInitialRightPolicyIds(newRightPolicyIds)

    const newLeftItems = unassignedPolicies.map(policy => ({
      key: String(policy.vacation_policy_id),
      label: policy.vacation_policy_name,
      selected: false,
      vacation_type_name: policy.vacation_type,
      vacation_policy_desc: policy.vacation_policy_desc,
      grant_method: policy.grant_method,
      grant_time_str: policy.grant_time_str,
      repeat_grant_desc: policy.repeat_grant_desc,
      effective_type: policy.effective_type,
      expiration_type: policy.expiration_type
    }))

    const newRightItems = assignedPolicies.map(policy => ({
      key: String(policy.vacation_policy_id),
      label: policy.vacation_policy_name,
      selected: false,
      vacation_type_name: policy.vacation_type,
      vacation_policy_desc: policy.vacation_policy_desc,
      grant_method: policy.grant_method,
      grant_time_str: policy.grant_time_str,
      repeat_grant_desc: policy.repeat_grant_desc,
      effective_type: policy.effective_type,
      expiration_type: policy.expiration_type
    }))

    setLeftItems(newLeftItems)
    setRightItems(newRightItems)
  }, [open, userId, assignmentStatus])

  // 변경사항이 있는지 확인
  const hasChanges = () => {
    const hasAddedPolicies = rightItems.some(item => initialLeftPolicyIds.has(item.key))
    const hasRemovedPolicies = leftItems.some(item => initialRightPolicyIds.has(item.key))
    return hasAddedPolicies || hasRemovedPolicies
  }

  const handleSave = async () => {
    // 추가된 정책
    const addedPolicyIds = rightItems
      .filter(item => initialLeftPolicyIds.has(item.key))
      .map(item => Number(item.key))

    // 제거된 정책
    const removedPolicyIds = leftItems
      .filter(item => initialRightPolicyIds.has(item.key))
      .map(item => Number(item.key))

    try {
      // 추가된 정책이 있으면 할당 API 호출
      if (addedPolicyIds.length > 0) {
        await assignPoliciesMutation.mutateAsync({
          userId: userId,
          vacationPolicyIds: addedPolicyIds
        })
      }

      // 제거된 정책이 있으면 회수 API 호출
      if (removedPolicyIds.length > 0) {
        await revokePoliciesMutation.mutateAsync({
          userId: userId,
          vacationPolicyIds: removedPolicyIds
        })
      }

      onOpenChange(false)
    } catch (error) {
      // 에러는 mutation의 onError에서 처리됨
      console.error(t('user.policySaveError'), error)
    }
  }

  const renderPolicyItem = (item: TransferItem) => {
    return (
      <div className='flex flex-col gap-2'>
        <div className='flex items-center gap-2'>
          <span className='font-medium text-sm'>{item.label}</span>
          <Badge variant='outline' className='text-[10px] h-4 px-1.5'>
            {getDisplayName(item.grant_method as string, grantMethodTypes)}
          </Badge>
          <Badge variant='default' className='text-[10px] h-4 px-1.5'>
            {item.vacation_type_name}
          </Badge>
        </div>
        {item.vacation_policy_desc && (
          <p className='text-xs text-muted-foreground'>{item.vacation_policy_desc}</p>
        )}
        <div className='flex items-center gap-4 text-xs text-muted-foreground'>
          <div className='flex items-center gap-1'>
            <Calendar className='h-3 w-3' />
            <span>{t('user.grant')}: {item.grant_time_str === '0' || item.grant_time_str === '0일' ? t('user.grantNoLimit') : item.grant_time_str}</span>
          </div>
          {item.repeat_grant_desc && (
            <div className='flex items-center gap-1'>
              <Repeat className='h-3 w-3' />
              <span>{item.repeat_grant_desc}</span>
            </div>
          )}
        </div>
        {(item.effective_type || item.expiration_type) && (
          <div className='flex items-center gap-1 text-xs text-muted-foreground'>
            <CalendarClock className='h-3 w-3' />
            <span>
              {t('user.effectiveRange')}: {getDisplayName(item.effective_type as string, effectiveTypes)} ~ {getDisplayName(item.expiration_type as string, expirationTypes)}
            </span>
          </div>
        )}
      </div>
    )
  }

  const filterPolicyItem = (item: TransferItem, search: string) => {
    const searchLower = search.toLowerCase()
    return (
      item.label.toLowerCase().includes(searchLower) ||
      (item.vacation_type_name as string)?.toLowerCase().includes(searchLower)
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-5xl max-h-[90vh]'>
        <DialogHeader>
          <DialogTitle>
            {t('user.vacationPolicyTitle')} {userName && `- ${userName}`}
          </DialogTitle>
        </DialogHeader>

        <div className='py-4 h-[500px] flex flex-col'>
          {isLoading ? (
            <div className='flex items-center justify-center h-full'>
              <div className='text-foreground/70'>{tc('loading')}</div>
            </div>
          ) : isError ? (
            <div className='flex items-center justify-center h-full'>
              <div className='text-red-500'>{t('user.policyError')}</div>
            </div>
          ) : (
            <TransferList
              leftItems={leftItems}
              rightItems={rightItems}
              onLeftChange={setLeftItems}
              onRightChange={setRightItems}
              leftTitle={t('user.unassignedPolicies')}
              rightTitle={t('user.assignedPolicies')}
              leftPlaceholder={t('user.searchPolicy')}
              rightPlaceholder={t('user.searchPolicy')}
              renderItem={renderPolicyItem}
              renderRightItem={renderPolicyItem}
              filterItem={filterPolicyItem}
            />
          )}
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            {tc('cancel')}
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges()}>
            {tc('save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { UserVacationPolicyDialog }