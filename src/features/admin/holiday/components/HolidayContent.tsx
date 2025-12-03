import { Button } from '@/components/shadcn/button'
import { useHolidayContext } from '@/features/admin/holiday/contexts/HolidayContext'
import {
    useDeleteHolidayMutation,
    useHolidaysByPeriodQuery,
    usePostHolidayMutation,
    usePutHolidayMutation,
} from '@/hooks/queries/useHolidays'
import {
    type GetHolidaysResp,
    type PostHolidayReq,
    type PutHolidayReq,
} from '@/lib/api/holiday'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import HolidayEditDialog from '@/features/admin/holiday/components/HolidayEditDialog'
import HolidayList from '@/features/admin/holiday/components/HolidayList'
import HolidayListSkeleton from '@/features/admin/holiday/components/HolidayListSkeleton'

const formatDateToYYYYMMDD = (dateString: string) => {
  if (!dateString) return ''
  return dayjs(dateString).format('YYYY-MM-DD')
}

const HolidayContent = () => {
  const { t } = useTranslation('admin')
  const { t: tc } = useTranslation('common')
  const { isDialogOpen, setIsDialogOpen, editingHoliday, setEditingHoliday } = useHolidayContext()

  const currentYear = new Date().getFullYear()
  const startDate = `${currentYear}-01-01`
  const endDate = `${currentYear}-12-31`

  const { data: holidays, isLoading: holidaysLoding, refetch } = useHolidaysByPeriodQuery(startDate, endDate, 'KR')
  const postMutation = usePostHolidayMutation()
  const putMutation = usePutHolidayMutation()
  const deleteMutation = useDeleteHolidayMutation()

  const handleSave = (data: PostHolidayReq) => {
    const payload = {
      ...data,
      holiday_date: formatDateToYYYYMMDD(data.holiday_date),
      lunar_date: data.lunar_date ? formatDateToYYYYMMDD(data.lunar_date) : ''
    }

    if (editingHoliday) {
      const putData: PutHolidayReq = {
        ...payload,
        holiday_id: editingHoliday.holiday_id,
      }
      putMutation.mutate(putData, {
        onSuccess: () => {
          refetch()
          setIsDialogOpen(false)
        }
      })
    } else {
      postMutation.mutate(payload, {
        onSuccess: () => {
          refetch()
          setIsDialogOpen(false)
        }
      })
    }
  }

  const handleEdit = (holiday: GetHolidaysResp) => {
    setEditingHoliday(holiday)
    setIsDialogOpen(true)
  }

  const handleDelete = (holiday_id: number) => {
    deleteMutation.mutate(String(holiday_id), {
      onSuccess: () => {
        refetch()
      }
    })
  }

  const handleAddClick = () => {
    setEditingHoliday(null)
    setIsDialogOpen(true)
  }

  return (
    <div className='flex w-full h-full p-6'>
      <div className='w-full max-w-4xl mx-auto'>
        <div className='flex items-center justify-between mb-6'>
          <div className='flex items-center gap-3'>
            <div>
              <h1 className='text-3xl font-bold text-card-foreground'>{t('holiday.title')}</h1>
              <p className='text-muted-foreground mt-1'>{t('holiday.description')}</p>
            </div>
          </div>
          <HolidayEditDialog
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            editingHoliday={editingHoliday}
            onSave={handleSave}
            trigger={
              <Button className='flex items-center gap-2' onClick={handleAddClick}>
                {tc('add')}
              </Button>
            }
          />
        </div>
        {holidaysLoding ? (
          <HolidayListSkeleton />
        ) : (
          <HolidayList
            holidays={holidays}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAddClick={handleAddClick}
          />
        )}
      </div>
    </div>
  )
}

export default HolidayContent
