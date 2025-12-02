import { Calendar } from '@/components/shadcn/calendar';
import { Card, CardContent } from '@/components/shadcn/card';
import { useUnregisteredWorkDatesQuery } from '@/hooks/queries/useWorks';
import { ko } from 'date-fns/locale';
import { useMemo, useState } from 'react';

const MissingWorkHistoryWidget = () => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState<Date>(today);

  const { data: unregisteredData } = useUnregisteredWorkDatesQuery(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1
  );

  const missingDates = useMemo(() => {
    if (!unregisteredData?.unregistered_dates) return [];
    return unregisteredData.unregistered_dates.map((dateStr: string) => new Date(dateStr));
  }, [unregisteredData]);

  return (
    <Card className="h-full flex flex-col border-none shadow-none py-0">
      <CardContent className="flex-1 flex items-center justify-center p-0">
        <Calendar
          mode="single"
          selected={currentDate}
          onSelect={(date) => date && setCurrentDate(date)}
          month={currentDate}
          onMonthChange={setCurrentDate}
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
  );
};

export default MissingWorkHistoryWidget;
