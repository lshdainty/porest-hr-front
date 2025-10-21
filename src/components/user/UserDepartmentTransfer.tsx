import { type UserInfo } from '@/api/department'
import { Button } from '@/components/shadcn/button'
import TransferList, { type TransferItem } from '@/components/shadcn/transfer'
import { useMemo, useState } from 'react'

interface UserDepartmentTransferProps {
  usersInDepartment: UserInfo[]
  usersNotInDepartment: UserInfo[]
  onTransfer?: (addedUsers: UserInfo[], removedUsers: UserInfo[]) => void
  isLoading?: boolean
}

export default function UserDepartmentTransfer({
  usersInDepartment,
  usersNotInDepartment,
  onTransfer,
  isLoading = false,
}: UserDepartmentTransferProps) {
  // 초기 상태를 useMemo로 계산
  const initialLeftUserIds = useMemo(
    () => new Set(usersNotInDepartment.map(u => u.user_id)),
    [usersNotInDepartment]
  )

  const initialRightUserIds = useMemo(
    () => new Set(usersInDepartment.map(u => u.user_id)),
    [usersInDepartment]
  )

  // 초기 아이템을 useMemo로 계산
  const initialLeftItems = useMemo(
    () => usersNotInDepartment.map(user => ({
      key: user.user_id,
      label: user.user_name,
      selected: false,
      ...user
    })),
    [usersNotInDepartment]
  )

  const initialRightItems = useMemo(
    () => usersInDepartment.map(user => ({
      key: user.user_id,
      label: user.user_name,
      selected: false,
      ...user
    })),
    [usersInDepartment]
  )

  const [leftItems, setLeftItems] = useState<TransferItem[]>(initialLeftItems)
  const [rightItems, setRightItems] = useState<TransferItem[]>(initialRightItems)

  const handleSave = () => {
    if (onTransfer) {
      // 추가된 사용자: 초기에는 왼쪽에 있었는데 현재는 오른쪽에 있는 사용자
      const addedUsers: UserInfo[] = rightItems
        .filter(item => initialLeftUserIds.has(item.key))
        .map(item => ({
          user_id: item.key,
          user_name: item.label
        }))

      // 제거된 사용자: 초기에는 오른쪽에 있었는데 현재는 왼쪽에 있는 사용자
      const removedUsers: UserInfo[] = leftItems
        .filter(item => initialRightUserIds.has(item.key))
        .map(item => ({
          user_id: item.key,
          user_name: item.label
        }))

      onTransfer(addedUsers, removedUsers)
    }
  }

  const renderUserItem = (item: TransferItem) => {
    return (
      <div className='flex flex-col items-start'>
        <span className='font-medium'>{item.label}</span>
        <span className='text-xs text-muted-foreground'>{item.key}</span>
      </div>
    )
  }

  const filterUserItem = (item: TransferItem, search: string) => {
    const searchLower = search.toLowerCase()
    return (
      item.label.toLowerCase().includes(searchLower) ||
      item.key.toLowerCase().includes(searchLower)
    )
  }

  if (isLoading) {
    return <div className='flex items-center justify-center h-full'>Loading...</div>
  }

  return (
    <div className='w-full h-full flex flex-col gap-4'>
      <div className='flex justify-end gap-2'>
        <Button onClick={handleSave} disabled={rightItems.length === 0}>
          저장
        </Button>
      </div>

      <TransferList
        leftItems={leftItems}
        rightItems={rightItems}
        onLeftChange={setLeftItems}
        onRightChange={setRightItems}
        leftTitle='전체 사용자'
        rightTitle='부서 소속 사용자'
        leftPlaceholder='사용자 검색...'
        rightPlaceholder='사용자 검색...'
        renderItem={renderUserItem}
        filterItem={filterUserItem}
      />
    </div>
  )
}
