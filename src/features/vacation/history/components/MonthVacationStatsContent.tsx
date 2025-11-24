import type { GetUserMonthlyVacationStatsResp } from '@/lib/api/vacation';
import { cn } from '@/lib/utils';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface MonthVacationStatsContentProps {
  data: GetUserMonthlyVacationStatsResp[] | undefined;
  className?: string;
}

const MonthVacationStatsContent = ({ data, className }: MonthVacationStatsContentProps) => {
  return (
    <div className={cn('w-full h-full', className)}>
      <ResponsiveContainer width='100%' height='100%'>
        <BarChart data={data}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey='month'
            stroke='#888888'
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}월`}
          />
          <YAxis
            stroke='#888888'
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            cursor={false}
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className='min-w-[8rem] rounded-lg border bg-background p-2 shadow-sm'>
                    <div className='flex items-center gap-2'>
                      <div className='h-3 w-3 rounded-full' style={{ backgroundColor: '#8884d8' }}></div>
                      <span className='text-[0.85rem] text-muted-foreground'>{`${label}월`}</span>
                      <span className='ml-auto font-bold'>{payload[0].payload.used_time_str}</span>
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
          <Bar dataKey='used_time' fill='#8884d8' radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthVacationStatsContent;
