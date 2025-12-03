import { useState } from 'react'
import { Button } from '@/components/shadcn/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/shadcn/select'
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
import { useTranslation } from 'react-i18next'
import HolidayEditDialog from '@/features/admin/holiday/components/HolidayEditDialog'
import HolidayList from '@/features/admin/holiday/components/HolidayList'
import HolidayListSkeleton from '@/features/admin/holiday/components/HolidayListSkeleton'

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
  const { data: holidays, isLoading: holidaysLoding, refetch } = useHolidaysByPeriodQuery(startDate, endDate, selectedCountry)

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
    <div className='flex w-full h-full p-6'>
      <div className='w-full max-w-4xl mx-auto'>
        <div className='flex items-center justify-between mb-6'>
          <div className='flex items-center gap-3'>
            <div>
              <h1 className='text-3xl font-bold text-card-foreground'>{t('holiday.title')}</h1>
              <p className='text-muted-foreground mt-1'>{t('holiday.description')}</p>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger className='w-[140px]'>
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
          </div>
        </div>
        <div className='flex items-center justify-end mb-4'>
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
