import { GetAvailableVacationsResp } from '@/lib/api/vacation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/shadcn/card';
import { cn } from '@/lib/utils';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Cell, Label, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

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
  }
}

interface VacationTypeStatsCardProps {
  value: GetAvailableVacationsResp[] | undefined
  className: string | undefined;
}

const VacationTypeStatsCard = ({ value, className }: VacationTypeStatsCardProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerDimensions, setContainerDimensions] = useState({ width: 400, height: 400 });
  const minChartSize = 300; // 최소 차트 크기

  const vacationTypes = useMemo(() => {
    if (value) {
      const formattedTypes = value.map((type: GetAvailableVacationsResp) => ({
        ...type,
        fill: renderChartColor(type.vacation_type)
      }));
      return formattedTypes;
    }
    return [];
  }, [value]);
  
  const totalVacationDays = useMemo(() => {
    return vacationTypes?.reduce((total, item) => total + item.total_remain_time, 0)
  }, [vacationTypes]);

  // 차트 크기 계산 - 최소 크기 보장
  const chartConfig = useMemo(() => {
    const { width, height } = containerDimensions;
    
    // 최소 크기 보장
    const effectiveWidth = Math.max(width, minChartSize);
    const effectiveHeight = Math.max(height, minChartSize);
    
    // 차트가 컨테이너보다 작아야 하므로 패딩 고려
    const availableSize = Math.min(effectiveWidth, effectiveHeight) - 60; // 패딩 60px
    const radius = Math.max(availableSize / 2, 80); // 최소 반지름 80px
    
    const strokeWidth = Math.max(Math.min(radius * 0.3, 40), 25); // 선 두께
    
    return {
      containerWidth: effectiveWidth,
      containerHeight: effectiveHeight,
      outerRadius: radius,
      innerRadius: Math.max(radius - strokeWidth, 20),
      needsScroll: width < minChartSize || height < minChartSize
    };
  }, [containerDimensions, minChartSize]);

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
    const timer = setTimeout(updateDimensions, 100);

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
      clearTimeout(timer);
      window.removeEventListener('resize', updateDimensions);
      resizeObserver.disconnect();
    };
  }, []);

  console.log(value);

  return (
    <Card className={cn(className, 'flex flex-col')}>
      <CardHeader className='items-center pb-0 flex-shrink-0'>
        <CardTitle>휴가 유형</CardTitle>
        <CardDescription>잔여 휴가별 휴가 유형</CardDescription>
      </CardHeader>
      <CardContent 
        className='flex-1 pb-0 flex flex-col' 
        ref={containerRef}
        style={{ 
          overflow: chartConfig.needsScroll ? 'auto' : 'visible',
          minHeight: `${minChartSize}px`
        }}
      >
        <div 
          className='flex items-center justify-center'
          style={{
            width: chartConfig.needsScroll ? `${chartConfig.containerWidth}px` : '100%',
            height: chartConfig.needsScroll ? `${chartConfig.containerHeight}px` : '100%',
            minWidth: `${minChartSize}px`,
            minHeight: `${minChartSize}px`
          }}
        >
          <ResponsiveContainer 
            width='100%' 
            height='100%'
          >
            <PieChart>
              <Tooltip
                cursor={false}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className='min-w-[8rem] rounded-lg border bg-background p-2 shadow-sm z-50'>
                        <div className='flex items-center gap-2'>
                          <div className='h-3 w-3 rounded-full' style={{ backgroundColor: data.fill }}></div>
                          <span className='text-[0.85rem] text-muted-foreground'>{data.vacation_type_name}</span>
                          <span className='ml-auto font-bold'>{data.total_remain_time_str}</span>
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Pie
                data={vacationTypes}
                dataKey='total_remain_time'
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
                            총 휴가
                          </tspan>
                        </text>
                      )
                    }
                    return null;
                  }}
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className='flex-col gap-2 text-sm pt-4 flex-shrink-0'>
        <div className='flex w-full items-center justify-center gap-2 text-muted-foreground flex-wrap'>
          {vacationTypes?.map((item) => (
            <div key={item.vacation_type} className='flex items-center gap-1.5 whitespace-nowrap'>
              <div className='h-2.5 w-2.5 rounded-full flex-shrink-0' style={{ backgroundColor: item.fill }} />
              <span className='text-xs'>{item.vacation_type_name}</span>
            </div>
          ))}
        </div>
      </CardFooter>
    </Card>
  )
}

export default VacationTypeStatsCard