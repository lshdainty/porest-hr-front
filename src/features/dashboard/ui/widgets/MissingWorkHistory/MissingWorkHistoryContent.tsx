import { Calendar } from '@/shared/ui/shadcn/calendar'
import { Card, CardContent } from '@/shared/ui/shadcn/card'
import { ko } from 'date-fns/locale'

interface MissingWorkHistoryContentProps {
  currentDate: Date
  onDateSelect: (date: Date) => void
  onMonthChange: (date: Date) => void
  missingDates: Date[]
}

export const MissingWorkHistoryContent = ({
  currentDate,
  onDateSelect,
  onMonthChange,
  missingDates
}: MissingWorkHistoryContentProps) => {
  return (
    <Card className="h-full flex flex-col border-none shadow-none py-0">
      <CardContent className="flex-1 flex items-center justify-center p-0">
        <Calendar
          mode="single"
          selected={currentDate}
          onSelect={(date) => date && onDateSelect(date)}
          month={currentDate}
          onMonthChange={onMonthChange}
          captionLayout="dropdown"
          fromYear={2020}
          toYear={2030}
          locale={ko}
          modifiers={{
            missing: missingDates
          }}
          modifiersClassNames={{
            missing: "bg-red-100 text-red-600 font-bold hover:bg-red-200 rounded-full"
          }}
          className="rounded-md border-none"
        />
      </CardContent>
    </Card>
  )
}
