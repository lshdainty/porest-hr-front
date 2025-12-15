import { VacationTypeStatsEmpty } from '@/features/vacation/history/components/VacationTypeStatsEmpty'
import { AvailableVacationByType, GetAvailableVacationsResp } from '@/lib/api/vacation'
import { cn } from '@/lib/utils'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Cell, Label, Pie, PieChart, Tooltip } from 'recharts'

const renderChartColor = (type: string) => {
  switch (type) {
    case 'ANNUAL':
      return '#0088FE';
    case 'MATERNITY':
      return '#FFBB28';
    case 'WEDDING':
      return '#8884d8';
    case 'BEREAVEMENT':
      return '#FF8042';
    case 'OVERTIME':
      return '#00C49F';
    default:
      return '#8884d8';
  }
}

interface VacationTypeStatsContentProps {
  data: GetAvailableVacationsResp | undefined;
  className?: string;
  showLegend?: boolean;
}

const VacationTypeStatsContent = ({ data, className, showLegend = true }: VacationTypeStatsContentProps) => {
  const { t } = useTranslation('vacation')
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 })

  const vacationTypes = useMemo(() => {
    if (data?.vacations) {
      const formattedTypes = data.vacations.map((type: AvailableVacationByType) => ({
        ...type,
        fill: renderChartColor(type.vacation_type)
      }));
      return formattedTypes;
    }
    return [];
  }, [data]);

  const totalVacationDays = useMemo(() => {
    return data?.total_remain_time_str ?? 0;
  }, [data]);

  // 차트 크기 계산 - 반응형
  const chartConfig = useMemo(() => {
    const { width, height } = containerDimensions;

    // 컨테이너 크기에 맞춰 차트 크기 조정
    const availableSize = Math.min(width, height) - 40; // 패딩 40px
    const radius = Math.max(availableSize / 2, 60); // 최소 반지름 60px로 줄임

    const strokeWidth = Math.max(Math.min(radius * 0.25, 40), 20); // 선 두께 조정

    return {
      outerRadius: radius,
      innerRadius: Math.max(radius - strokeWidth, 10),
    };
  }, [containerDimensions]);

  // 컨테이너 크기 추적
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setContainerDimensions({
          width: clientWidth,
          height: clientHeight
        });
      }
    };

    // 초기 크기 설정
    updateDimensions();
    const timer = setTimeout(updateDimensions, 50);

    // ResizeObserver로 크기 변화 감지
    const resizeObserver = new ResizeObserver(updateDimensions);

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // 부모 카드도 관찰
    const cardElement = containerRef.current?.closest('.card');
    if (cardElement) {
      resizeObserver.observe(cardElement);
    }

    window.addEventListener('resize', updateDimensions);

    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', updateDimensions)
      resizeObserver.disconnect()
    }
  }, [])

  if (!data || !data.vacations || data.vacations.length === 0) {
    return <VacationTypeStatsEmpty className={className} />
  }

  return (
    <div className={cn('flex flex-col h-full w-full', className)}>
      <div
        className='flex-1 pb-0 flex flex-col relative min-h-[200px]'
        ref={containerRef}
      >
        <div
          className='flex items-center justify-center absolute inset-0'
        >
          {containerDimensions.width > 0 && containerDimensions.height > 0 && (
          <PieChart width={containerDimensions.width} height={containerDimensions.height}>
            <Tooltip
              cursor={false}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className='min-w-32 rounded-lg border bg-background p-2 shadow-sm z-50'>
                      <div className='flex items-center gap-2'>
                        <div className='h-3 w-3 rounded-full' style={{ backgroundColor: data.fill }}></div>
                        <span className='text-[0.85rem] text-muted-foreground'>{data.vacation_type_name}</span>
                        <span className='ml-auto font-bold'>{data.remain_time_str}</span>
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Pie
              data={vacationTypes}
              dataKey='remain_time'
              nameKey='vacation_type'
              cx='50%'
              cy='50%'
              innerRadius={chartConfig.innerRadius}
              outerRadius={chartConfig.outerRadius}
              strokeWidth={0}
            >
              {vacationTypes?.map((entry) => (
                <Cell key={`cell-${entry.vacation_type_name}`} fill={entry.fill} />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    // 차트 크기에 따른 폰트 크기 조정
                    const fontSize = Math.max(Math.min(chartConfig.outerRadius * 0.25, 36), 18);
                    const smallFontSize = Math.max(fontSize * 0.4, 12);

                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor='middle'
                        dominantBaseline='middle'
                        className='text-center'
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className='fill-foreground font-bold'
                          fontSize={fontSize}
                        >
                          {totalVacationDays?.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + fontSize * 0.7}
                          className='fill-muted-foreground'
                          fontSize={smallFontSize}
                        >
                          {t('history.totalVacation')}
                        </tspan>
                      </text>
                    )
                  }
                  return null;
                }}
              />
            </Pie>
          </PieChart>
          )}
        </div>
      </div>
      {showLegend && (
        <div className='flex-col gap-2 text-sm pt-4 shrink-0'>
          <div className='flex w-full items-center justify-center gap-2 text-muted-foreground flex-wrap'>
            {vacationTypes?.map((item) => (
              <div key={item.vacation_type} className='flex items-center gap-1.5 whitespace-nowrap'>
                <div className='h-2.5 w-2.5 rounded-full shrink-0' style={{ backgroundColor: item.fill }} />
                <span className='text-xs'>{item.vacation_type_name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export { VacationTypeStatsContent }
