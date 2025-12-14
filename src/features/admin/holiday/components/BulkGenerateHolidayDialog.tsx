import { Button } from '@/components/shadcn/button'
import { Checkbox } from '@/components/shadcn/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/shadcn/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/shadcn/table'
import { useCountryCodeTypesQuery } from '@/hooks/queries/useTypes'
import {
  useBulkSaveHolidaysMutation,
  useRecurringHolidaysPreviewQuery,
} from '@/hooks/queries/useHolidays'
import { type BulkSaveHolidayItem, type GetRecurringHolidaysPreviewResp } from '@/lib/api/holiday'
import { CalendarPlus, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import dayjs from 'dayjs'

interface BulkGenerateHolidayDialogProps {
  trigger?: React.ReactNode
  onSuccess?: () => void
}

const generateYearOptions = () => {
  const currentYear = new Date().getFullYear()
  const years: number[] = []
  for (let i = currentYear; i <= currentYear + 5; i++) {
    years.push(i)
  }
  return years
}

const BulkGenerateHolidayDialog = ({
  trigger,
  onSuccess,
}: BulkGenerateHolidayDialogProps) => {
  const { t } = useTranslation('admin')
  const { t: tc } = useTranslation('common')

  const [isOpen, setIsOpen] = useState(false)
  const [targetYear, setTargetYear] = useState<number>(new Date().getFullYear())
  const [selectedCountry, setSelectedCountry] = useState<string>('KR')
  const [selectedHolidays, setSelectedHolidays] = useState<Set<number>>(new Set())
  const [isPreviewLoaded, setIsPreviewLoaded] = useState(false)

  const { data: countryTypes } = useCountryCodeTypesQuery()
  const {
    data: previewHolidays,
    isLoading: isPreviewLoading,
    refetch: refetchPreview,
  } = useRecurringHolidaysPreviewQuery(targetYear, selectedCountry, isPreviewLoaded)

  const bulkSaveMutation = useBulkSaveHolidaysMutation()

  const yearOptions = generateYearOptions()

  useEffect(() => {
    if (!isOpen) {
      setIsPreviewLoaded(false)
      setSelectedHolidays(new Set())
    }
  }, [isOpen])

  useEffect(() => {
    if (previewHolidays) {
      setSelectedHolidays(new Set(previewHolidays.map((_, index) => index)))
    }
  }, [previewHolidays])

  const handleLoadPreview = () => {
    setIsPreviewLoaded(true)
    refetchPreview()
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked && previewHolidays) {
      setSelectedHolidays(new Set(previewHolidays.map((_, index) => index)))
    } else {
      setSelectedHolidays(new Set())
    }
  }

  const handleSelectHoliday = (index: number, checked: boolean) => {
    const newSelected = new Set(selectedHolidays)
    if (checked) {
      newSelected.add(index)
    } else {
      newSelected.delete(index)
    }
    setSelectedHolidays(newSelected)
  }

  const handleSave = () => {
    if (!previewHolidays || selectedHolidays.size === 0) return

    const holidaysToSave: BulkSaveHolidayItem[] = previewHolidays
      .filter((_, index) => selectedHolidays.has(index))
      .map((holiday) => ({
        holiday_name: holiday.holiday_name,
        holiday_date: holiday.holiday_date,
        holiday_type: holiday.holiday_type,
        holiday_icon: holiday.holiday_icon || '',
        country_code: holiday.country_code,
        lunar_yn: holiday.lunar_yn,
        lunar_date: holiday.lunar_date || '',
        is_recurring: holiday.is_recurring,
      }))

    bulkSaveMutation.mutate(
      { holidays: holidaysToSave },
      {
        onSuccess: (data) => {
          toast.success(t('holiday.bulkSaveSuccess', { count: data.saved_count }))
          setIsOpen(false)
          onSuccess?.()
        },
        onError: (error) => {
          toast.error(error.message || t('holiday.bulkSaveError'))
        },
      }
    )
  }

  const getHolidayTypeName = (type: string) => {
    switch (type) {
      case 'PUBLIC':
        return t('holiday.typePublic')
      case 'ETC':
        return t('holiday.typeEtc')
      case 'SUBSTITUTE':
        return t('holiday.typeSubstitute')
      default:
        return type
    }
  }

  const isAllSelected =
    previewHolidays && previewHolidays.length > 0 && selectedHolidays.size === previewHolidays.length

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <CalendarPlus className="h-4 w-4" />
            {t('holiday.bulkGenerateBtn')}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{t('holiday.bulkGenerateTitle')}</DialogTitle>
          <DialogDescription>{t('holiday.bulkGenerateDescription')}</DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-4 py-4">
          <Select value={selectedCountry} onValueChange={setSelectedCountry}>
            <SelectTrigger className="w-[140px]">
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

          <Select value={String(targetYear)} onValueChange={(value) => setTargetYear(Number(value))}>
            <SelectTrigger className="w-[100px]">
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

          <Button onClick={handleLoadPreview} disabled={isPreviewLoading}>
            {isPreviewLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {tc('loading')}
              </>
            ) : (
              t('holiday.loadPreview')
            )}
          </Button>
        </div>

        {isPreviewLoaded && (
          <div className="flex-1 min-h-0 overflow-auto border rounded-md">
            {isPreviewLoading ? (
              <div className="flex items-center justify-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : previewHolidays && previewHolidays.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={isAllSelected}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead className="w-12">{t('holiday.icon')}</TableHead>
                    <TableHead>{t('holiday.name')}</TableHead>
                    <TableHead>{t('holiday.date')}</TableHead>
                    <TableHead>{t('holiday.type')}</TableHead>
                    <TableHead>{t('holiday.lunarYn')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewHolidays.map((holiday, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Checkbox
                          checked={selectedHolidays.has(index)}
                          onCheckedChange={(checked) =>
                            handleSelectHoliday(index, checked as boolean)
                          }
                        />
                      </TableCell>
                      <TableCell className="text-center text-lg">
                        {holiday.holiday_icon || '-'}
                      </TableCell>
                      <TableCell className="font-medium">{holiday.holiday_name}</TableCell>
                      <TableCell>{dayjs(holiday.holiday_date).format('YYYY-MM-DD')}</TableCell>
                      <TableCell>{getHolidayTypeName(holiday.holiday_type)}</TableCell>
                      <TableCell>
                        {holiday.lunar_yn === 'Y' ? t('holiday.lunarYes') : t('holiday.lunarNo')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex items-center justify-center h-40 text-muted-foreground">
                {t('holiday.noRecurringHolidays')}
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {previewHolidays && isPreviewLoaded && (
              <>
                {t('holiday.selectedCount', { count: selectedHolidays.size })} / {previewHolidays.length}
              </>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              {tc('cancel')}
            </Button>
            <Button
              onClick={handleSave}
              disabled={
                !isPreviewLoaded ||
                selectedHolidays.size === 0 ||
                bulkSaveMutation.isPending
              }
            >
              {bulkSaveMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {tc('saving')}
                </>
              ) : (
                tc('save')
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { BulkGenerateHolidayDialog }
