import { type UserInfo } from '@/api/department'
import { Button } from '@/components/shadcn/button'
import TransferList, { type TransferItem } from '@/components/shadcn/transfer'
import { useEffect, useState } from 'react'

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
  // 초기 사용자 ID 추적을 위한 상태
  const [initialLeftUserIds, setInitialLeftUserIds] = useState<Set<string>>(new Set())
  const [initialRightUserIds, setInitialRightUserIds] = useState<Set<string>>(new Set())

  const [leftItems, setLeftItems] = useState<TransferItem[]>([])
  const [rightItems, setRightItems] = useState<TransferItem[]>([])

  // props가 변경될 때마다 상태 업데이트
  useEffect(() => {
    const newLeftUserIds = new Set(usersNotInDepartment.map(u => u.user_id))
    const newRightUserIds = new Set(usersInDepartment.map(u => u.user_id))

    setInitialLeftUserIds(newLeftUserIds)
    setInitialRightUserIds(newRightUserIds)

    const newLeftItems = usersNotInDepartment.map(user => ({
      key: user.user_id,
      label: user.user_name,
      selected: false,
      ...user
    }))

    const newRightItems = usersInDepartment.map(user => ({
      key: user.user_id,
      label: user.user_name,
      selected: false,
      ...user
    }))

    setLeftItems(newLeftItems)
    setRightItems(newRightItems)
  }, [usersInDepartment, usersNotInDepartment])

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
