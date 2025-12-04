import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import NoticeEditDialog from '@/features/admin/notice/components/NoticeEditDialog'
import NoticeList from '@/features/admin/notice/components/NoticeList'
import NoticeListSkeleton from '@/features/admin/notice/components/NoticeListSkeleton'
import { useNoticeContext } from '@/features/admin/notice/contexts/NoticeContext'
import {
  useCreateNoticeMutation,
  useDeleteNoticeMutation,
  useNoticesQuery,
  useSearchNoticesQuery,
  useUpdateNoticeMutation,
} from '@/hooks/queries/useNotices'
import { useUser } from '@/contexts/UserContext'
import {
  type CreateNoticeReq,
  type NoticeListResp,
  type UpdateNoticeReq,
} from '@/lib/api/notice'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Search } from 'lucide-react'

const NoticeContent = () => {
  const { t } = useTranslation('admin')
  const { t: tc } = useTranslation('common')
  const { isDialogOpen, setIsDialogOpen, editingNotice, setEditingNotice } = useNoticeContext()
  const { loginUser } = useUser()

  const [page, setPage] = useState(0)
  const [size] = useState(10)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [searchInput, setSearchInput] = useState('')

  const { data: noticesData, isLoading: noticesLoading, refetch } = searchKeyword
    ? useSearchNoticesQuery(searchKeyword, page, size)
    : useNoticesQuery(page, size)

  const createMutation = useCreateNoticeMutation()
  const updateMutation = useUpdateNoticeMutation()
  const deleteMutation = useDeleteNoticeMutation()

  const handleSave = (data: CreateNoticeReq) => {
    const payload = {
      ...data,
      writer_id: loginUser?.user_id || '',
    }

    if (editingNotice) {
      const updateData: UpdateNoticeReq = {
        title: payload.title,
        content: payload.content,
        notice_type: payload.notice_type,
        is_pinned: payload.is_pinned,
        start_date: payload.start_date,
        end_date: payload.end_date,
      }
      updateMutation.mutate({ noticeId: editingNotice.notice_id, data: updateData }, {
        onSuccess: () => {
          refetch()
          setIsDialogOpen(false)
        }
      })
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          refetch()
          setIsDialogOpen(false)
        }
      })
    }
  }

  const handleEdit = (notice: NoticeListResp) => {
    setEditingNotice(notice)
    setIsDialogOpen(true)
  }

  const handleDelete = (noticeId: number) => {
    deleteMutation.mutate(noticeId, {
      onSuccess: () => {
        refetch()
      }
    })
  }

  const handleAddClick = () => {
    setEditingNotice(null)
    setIsDialogOpen(true)
  }

  const handleSearch = () => {
    setSearchKeyword(searchInput)
    setPage(0)
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleClearSearch = () => {
    setSearchInput('')
    setSearchKeyword('')
    setPage(0)
  }

  const totalPages = noticesData?.totalPages || 0

  return (
    <div className='flex w-full h-full p-4 md:p-6'>
      <div className='w-full max-w-4xl mx-auto'>
        <div className='flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4'>
          <div>
            <h1 className='text-2xl md:text-3xl font-bold text-card-foreground'>{t('notice.title')}</h1>
            <p className='text-sm md:text-base text-muted-foreground mt-1'>{t('notice.description')}</p>
          </div>

          <div className='flex items-center gap-2'>
            <NoticeEditDialog
              isOpen={isDialogOpen}
              onOpenChange={setIsDialogOpen}
              editingNotice={editingNotice}
              onSave={handleSave}
              trigger={
                <Button className='flex items-center gap-2 shrink-0' onClick={handleAddClick}>
                  {tc('add')}
                </Button>
              }
            />
          </div>
        </div>

        <div className='flex items-center gap-2 mb-4'>
          <div className='relative flex-1 max-w-sm'>
            <Input
              placeholder={t('notice.searchPlaceholder')}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className='pr-10'
            />
            <Button
              variant='ghost'
              size='sm'
              className='absolute right-0 top-0 h-full px-3'
              onClick={handleSearch}
            >
              <Search className='h-4 w-4' />
            </Button>
          </div>
          {searchKeyword && (
            <Button variant='outline' size='sm' onClick={handleClearSearch}>
              {tc('clear')}
            </Button>
          )}
        </div>

        {noticesLoading ? (
          <NoticeListSkeleton />
        ) : (
          <>
            <NoticeList
              notices={noticesData?.content}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAddClick={handleAddClick}
            />

            {totalPages > 1 && (
              <div className='flex justify-center items-center gap-2 mt-6'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                >
                  {tc('previous')}
                </Button>
                <span className='text-sm text-muted-foreground'>
                  {page + 1} / {totalPages}
                </span>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                >
                  {tc('next')}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default NoticeContent
