import { Calendar } from '@/components/shadcn/calendar';
import { Card, CardContent } from '@/components/shadcn/card';
import { ko } from 'date-fns/locale';
import { useMemo, useState } from 'react';

const MissingWorkHistoryWidget = () => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState<Date>(today);

  // Mock Data Generation
  const missingDates = useMemo(() => {
    const dates: Date[] = [];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Randomly select 3-7 days as missing work history
    const numberOfMissingDays = Math.floor(Math.random() * 5) + 3;
    const selectedDays = new Set<number>();

    while (selectedDays.size < numberOfMissingDays) {
      const day = Math.floor(Math.random() * daysInMonth) + 1;
      // Skip weekends for realism (optional, but good for work history)
      const date = new Date(year, month, day);
      const dayOfWeek = date.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        selectedDays.add(day);
      }
    }

    selectedDays.forEach(day => {
      dates.push(new Date(year, month, day));
    });

    return dates;
  }, [currentDate]);

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
