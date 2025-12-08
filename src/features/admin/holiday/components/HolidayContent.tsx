import QueryAsyncBoundary from '@/components/common/QueryAsyncBoundary'
import { Button } from '@/components/shadcn/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/select'
import { EmptyHoliday } from '@/features/admin/holiday/components/EmptyHoliday'
import { HolidayEditDialog } from '@/features/admin/holiday/components/HolidayEditDialog'
import { HolidayList } from '@/features/admin/holiday/components/HolidayList'
import { HolidayListSkeleton } from '@/features/admin/holiday/components/HolidayListSkeleton'
import { useHolidayContext } from '@/features/admin/holiday/contexts/HolidayContext'
import {
  useDeleteHolidayMutation,
  useHolidaysByPeriodQuery,
  usePostHolidayMutation,
  usePutHolidayMutation,
} from '@/hooks/queries/useHolidays'
import { useCountryCodeTypesQuery } from '@/hooks/queries/useTypes'
import {
  type GetHolidaysResp,
  type PostHolidayReq,
  type PutHolidayReq,
} from '@/lib/api/holiday'
import dayjs from 'dayjs'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const formatDateToYYYYMMDD = (dateString: string) => {
  if (!dateString) return ''
  return dayjs(dateString).format('YYYY-MM-DD')
}

// 연도 옵션 생성 (현재 연도 기준 -5 ~ +5년)
const generateYearOptions = () => {
  const currentYear = new Date().getFullYear()
  const years: number[] = []
  for (let i = currentYear - 5; i <= currentYear + 5; i++) {
    years.push(i)
  }
  return years
}

const HolidayContent = () => {
  const { t } = useTranslation('admin')
  const { t: tc } = useTranslation('common')
  const { isDialogOpen, setIsDialogOpen, editingHoliday, setEditingHoliday } = useHolidayContext()

  const currentYear = new Date().getFullYear()
  const [selectedYear, setSelectedYear] = useState<number>(currentYear)
  const [selectedCountry, setSelectedCountry] = useState<string>('KR')

  const startDate = `${selectedYear}-01-01`
  const endDate = `${selectedYear}-12-31`

  const { data: countryTypes } = useCountryCodeTypesQuery()
  const { data: holidays, isLoading, error, refetch } = useHolidaysByPeriodQuery(startDate, endDate, selectedCountry)

  const yearOptions = generateYearOptions()
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
    <div className='flex w-full h-full p-4 sm:p-6 md:p-8'>
      <div className='w-full flex flex-col h-full'>
        <div className='flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4 shrink-0'>
          <div>
            <h1 className='text-2xl md:text-3xl font-bold text-card-foreground'>{t('holiday.title')}</h1>
            <p className='text-sm md:text-base text-muted-foreground mt-1'>{t('holiday.description')}</p>
          </div>

          <div className='flex items-center gap-2'>
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger className='flex-1 md:w-[140px]'>
                <SelectValue placeholder={t('holiday.countryPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                {countryTypes?.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={String(selectedYear)} onValueChange={(value) => setSelectedYear(Number(value))}>
              <SelectTrigger className='w-[100px]'>
                <SelectValue placeholder={t('holiday.yearPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                {yearOptions.map((year) => (
                  <SelectItem key={year} value={String(year)}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <HolidayEditDialog
              isOpen={isDialogOpen}
              onOpenChange={setIsDialogOpen}
              editingHoliday={editingHoliday}
              onSave={handleSave}
              trigger={
                <Button className='flex items-center gap-2 shrink-0' onClick={handleAddClick}>
                  {tc('add')}
                </Button>
              }
            />
          </div>
        </div>
        <div className='flex-1 min-h-0'>
          <QueryAsyncBoundary
            queryState={{ isLoading: false, error, data: [] }}
            loadingComponent={<HolidayListSkeleton />}
            emptyComponent={<EmptyHoliday onAddClick={handleAddClick} className="h-full flex items-center justify-center" />}
            isEmpty={(data) => !data || data.length === 0}
          >
            <HolidayList
              holidays={holidays}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAddClick={handleAddClick}
            />
          </QueryAsyncBoundary>
        </div>
      </div>
    </div>
  )
}

export { HolidayContent }
