import { type UserInfo } from '@/api/department'
import { Button } from '@/components/shadcn/button'
import { Checkbox } from '@/components/shadcn/checkbox'
import { Label } from '@/components/shadcn/label'
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
          user_name: item.label,
          main_yn: (item.main_yn || 'N') as 'Y' | 'N'
        }))

      // 제거된 사용자: 초기에는 오른쪽에 있었는데 현재는 왼쪽에 있는 사용자
      const removedUsers: UserInfo[] = leftItems
        .filter(item => initialRightUserIds.has(item.key))
        .map(item => ({
          user_id: item.key,
          user_name: item.label,
          main_yn: 'N' as 'Y' | 'N'
        }))

      onTransfer(addedUsers, removedUsers)
    }
  }

  const handleMainDepartmentChange = (userId: string, isMain: boolean) => {
    const updatedItems = rightItems.map((item) => {
      if (item.key === userId) {
        return { ...item, main_yn: isMain ? 'Y' : 'N' }
      }
      return item
    })
    setRightItems(updatedItems)
  }

  const renderLeftUserItem = (item: TransferItem) => {
    return (
      <div className='flex flex-col items-start'>
        <span className='font-medium'>{item.label}</span>
        <span className='text-xs text-muted-foreground'>{item.key}</span>
      </div>
    )
  }

  const renderRightUserItem = (item: TransferItem) => {
    return (
      <div className='flex items-center justify-between w-full gap-2'>
        <div className='flex flex-col items-start flex-1'>
          <span className='font-medium'>{item.label}</span>
          <span className='text-xs text-muted-foreground'>{item.key}</span>
        </div>
        <div className='flex items-center gap-2' onClick={(e) => e.stopPropagation()}>
          <Checkbox
            id={`main-${item.key}`}
            checked={item.main_yn === 'Y'}
            onCheckedChange={(checked) => handleMainDepartmentChange(item.key, checked === true)}
          />
          <Label
            htmlFor={`main-${item.key}`}
            className='text-xs text-muted-foreground cursor-pointer whitespace-nowrap'
          >
            메인부서
          </Label>
        </div>
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
        renderItem={renderLeftUserItem}
        renderRightItem={renderRightUserItem}
        filterItem={filterUserItem}
      />
    </div>
  )
}
