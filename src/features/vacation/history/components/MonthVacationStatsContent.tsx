import { MonthVacationStatsEmpty } from '@/features/vacation/history/components/MonthVacationStatsEmpty'
import type { GetUserMonthlyVacationStatsResp } from '@/lib/api/vacation'
import { cn } from '@/lib/utils'
import { useEffect, useRef, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts'

interface MonthVacationStatsContentProps {
  data: GetUserMonthlyVacationStatsResp[] | undefined
  className?: string
}

export const MonthVacationStatsContent = ({ data, className }: MonthVacationStatsContentProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const hasData = data && data.length > 0 && data.some((item) => item.used_time > 0)

  useEffect(() => {
    if (!hasData) return

    const updateDimensions = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current
        setDimensions({ width: clientWidth, height: clientHeight })
      }
    }

    updateDimensions()
    const timer = setTimeout(updateDimensions, 50)
    const resizeObserver = new ResizeObserver(updateDimensions)
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    return () => {
      clearTimeout(timer)
      resizeObserver.disconnect()
    }
  }, [hasData])

  if (!hasData) {
    return <MonthVacationStatsEmpty className={className} />
  }

  return (
    <div className={cn('flex flex-col h-full w-full', className)}>
      <div className='flex-1 pb-0 flex flex-col relative min-h-[200px]' ref={containerRef}>
        <div className='flex items-center justify-center absolute inset-0'>
          {dimensions.width > 0 && dimensions.height > 0 && (
            <BarChart
            width={dimensions.width}
            height={dimensions.height}
            data={data}
            margin={{ left: 0 }}
          >
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
                    <div className='min-w-32 rounded-lg border bg-background p-2 shadow-sm'>
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
          )}
        </div>
      </div>
    </div>
  )
}
