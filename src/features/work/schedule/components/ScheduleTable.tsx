import { Avatar, AvatarFallback, AvatarImage } from "@/components/shadcn/avatar";
import { Badge } from "@/components/shadcn/badge";
import { GetUsersResp } from "@/lib/api/user";
import { cn } from "@/lib/utils";

// --- Types ---

interface ScheduleItem {
  id: string;
  startTime: string; // "HH:MM" format (24h)
  endTime: string;   // "HH:MM" format (24h)
}

interface ScheduleTableProps {
  users: GetUsersResp[];
}

// --- Helper Functions ---

const START_HOUR = 7;
const END_HOUR = 22;
const TOTAL_HOURS = END_HOUR - START_HOUR;

/**
 * Converts "HH:MM" time string to a percentage position on the timeline (0% - 100%)
 */
const getPositionPercentage = (timeStr: string) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const totalMinutesFromStart = (hours - START_HOUR) * 60 + minutes;
  const totalTimelineMinutes = TOTAL_HOURS * 60;
  return (totalMinutesFromStart / totalTimelineMinutes) * 100;
};

/**
 * Parses work_time string like "9~6" to start and end time in "HH:MM" format
 */
const parseWorkTime = (workTime: string): { startTime: string; endTime: string } | null => {
  if (!workTime || workTime === '-') return null;

  const match = workTime.match(/(\d+) ~ (\d+)/);
  if (!match) return null;

  let startHour = parseInt(match[1], 10);
  let endHour = parseInt(match[2], 10);

  // 끝 시간이 시작 시간보다 작으면 오후로 간주 (예: 6 -> 18)
  if (endHour < startHour) {
    endHour += 12;
  }

  return {
    startTime: `${startHour.toString().padStart(2, '0')}:00`,
    endTime: `${endHour.toString().padStart(2, '0')}:00`
  };
};

const formatTimeRange = (start: string, end: string) => {
  const format = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    const ampm = h < 12 ? '오전' : '오후';
    const formattedH = h > 12 ? h - 12 : h;
    return `${ampm} ${formattedH}:${m.toString().padStart(2, '0')}`;
  }
  return `${format(start)} - ${format(end)}`;
};

/**
 * Calculate total work hours from start and end time
 */
const calculateWorkHours = (startTime: string, endTime: string): string => {
  const [startH, startM] = startTime.split(':').map(Number);
  const [endH, endM] = endTime.split(':').map(Number);
  const totalMinutes = (endH * 60 + endM) - (startH * 60 + startM);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return minutes > 0 ? `${hours}시간 ${minutes}분` : `${hours}시간`;
};

// --- Components ---

const TimeGridHeader = () => {
  const hours = Array.from({ length: TOTAL_HOURS }, (_, i) => START_HOUR + i);

  return (
    <div className="relative flex h-10 border-b border-border items-center text-xs text-muted-foreground select-none">
      {hours.map((hour, index) => (
        <div key={hour} style={{ width: `${100 / TOTAL_HOURS}%` }} className="relative h-full flex items-center">
          <span className={cn("absolute", index === 0 ? "left-0" : "-translate-x-1/2")}>{hour}</span>
        </div>
      ))}
      {/* 마지막 시간 (20) */}
      <span className="absolute right-0">{END_HOUR}</span>
    </div>
  );
};

const BackgroundGrid = () => {
  // 점심시간: 12~13시, 저녁시간: 18~19시
  const LUNCH_START = 12;
  const LUNCH_END = 13;
  const DINNER_START = 18;
  const DINNER_END = 19;

  return (
    <div className="absolute inset-0 flex pointer-events-none">
      {Array.from({ length: TOTAL_HOURS }).map((_, i) => {
        const hour = START_HOUR + i;
        const isBreakTime = (hour >= LUNCH_START && hour < LUNCH_END) || (hour >= DINNER_START && hour < DINNER_END);

        return (
          <div
            key={i}
            className="h-full border-r border-border/50 relative"
            style={{ width: `${100 / TOTAL_HOURS}%` }}
          >
            {isBreakTime && (
              <div
                className="absolute inset-0 opacity-10 dark:opacity-20"
                style={{
                  background: `repeating-linear-gradient(
                                        45deg,
                                        currentColor,
                                        currentColor 2px,
                                        transparent 2px,
                                        transparent 8px
                                    )`
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  )
}

const ScheduleBar = ({ item }: { item: ScheduleItem }) => {
  const left = getPositionPercentage(item.startTime);
  const width = getPositionPercentage(item.endTime) - left;

  return (
    <div
      className="absolute top-1/2 -translate-y-1/2 h-12 rounded-lg border flex overflow-hidden text-xs shadow-sm group transition-all hover:z-10 hover:shadow-md cursor-pointer bg-primary/10 text-primary border-primary/20"
      style={{ left: `${left}%`, width: `${width}%` }}
    >
      {/* Content Area */}
      <div className="flex flex-col justify-center px-3 z-10 font-medium whitespace-nowrap">
        <div className="opacity-80 text-[10px]">
          {formatTimeRange(item.startTime, item.endTime)}
        </div>
      </div>
    </div>
  );
};

const ScheduleTable = ({ users }: ScheduleTableProps) => {

  return (
    <div className="bg-background overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Header Row */}
          <div className="flex border-b border-border bg-background sticky top-0 z-30">
            <div className="w-[120px] sm:w-64 shrink-0 p-4 border-r border-border bg-background sticky left-0 z-40" /> {/* User Info Header Placeholder */}
            <div className="flex-1 relative min-w-[600px]">
              <TimeGridHeader />
            </div>
          </div>

          {/* User Rows */}
          <div className="divide-y divide-border">
            {users.map((user) => {
              const workTime = parseWorkTime(user.user_work_time);
              const totalWorkTime = workTime
                ? calculateWorkHours(workTime.startTime, workTime.endTime)
                : '-';

              return (
                <div key={user.user_id} className="flex group hover:bg-muted/50 transition-colors h-24">
                  {/* Left: User Info - Sticky */}
                  <div className="w-[120px] sm:w-64 shrink-0 p-2 sm:p-4 flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3 border-r border-border bg-background sticky left-0 z-20">
                    <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border border-border">
                      <AvatarImage src={user.profile_url} />
                      <AvatarFallback>{user.user_name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-center sm:items-start text-center sm:text-left overflow-hidden w-full">
                      <span className="font-bold text-foreground text-xs sm:text-sm truncate w-full">{user.user_name}</span>
                      <span className="text-[10px] sm:text-xs text-muted-foreground truncate w-full hidden sm:block">{user.main_department_name_kr || user.user_role_name}</span>
                      <Badge variant="secondary" className="mt-1 w-fit text-[10px] px-1.5 py-0 h-5 bg-primary/10 text-primary hover:bg-primary/20 font-normal border-primary/20">
                        {totalWorkTime}
                      </Badge>
                    </div>
                  </div>

                  {/* Right: Timeline Track */}
                  <div className="flex-1 relative min-w-[600px]">
                    {/* Vertical Grid Lines */}
                    <BackgroundGrid />

                    {/* Schedule Bars */}
                    <div className="absolute inset-0 w-full h-full">
                      {workTime && (
                        <ScheduleBar
                          item={{
                            id: user.user_id,
                            startTime: workTime.startTime,
                            endTime: workTime.endTime
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ScheduleTable;
