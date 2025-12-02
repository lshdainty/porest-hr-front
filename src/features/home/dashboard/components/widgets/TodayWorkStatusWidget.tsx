import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card';
import { Progress } from '@/components/shadcn/progress';
import { useTodayWorkStatusQuery } from '@/hooks/queries/useWorks';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';

const TodayWorkStatusWidget = () => {
  const { data: status, isLoading } = useTodayWorkStatusQuery();

  if (isLoading) {
    return (
      <Card className="h-full flex flex-col border-none shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            업무이력 작성 현황
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="animate-pulse h-8 w-24 bg-muted rounded" />
        </CardContent>
      </Card>
    );
  }

  if (!status) {
    return (
      <Card className="h-full flex flex-col border-none shadow-none">
        <CardContent className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
          데이터를 불러올 수 없습니다.
        </CardContent>
      </Card>
    );
  }

  const { total_hours, required_hours, completed } = status;
  const percentage = Math.min((total_hours / required_hours) * 100, 100);

  return (
    <Card className="h-full flex flex-col border-none shadow-none">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Clock className="h-4 w-4" />
            업무이력 작성 현황
          </CardTitle>
          {completed ? (
            <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-xs font-medium bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
              <CheckCircle2 className="h-3 w-3" />
              <span>달성 완료</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400 text-xs font-medium bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded-full">
              <AlertCircle className="h-3 w-3" />
              <span>진행 중</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center gap-4">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-3xl font-bold tracking-tight">
              {total_hours}
            </span>
            <span className="text-sm text-muted-foreground ml-1">
              / {required_hours} 시간
            </span>
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            {Math.round(percentage)}%
          </span>
        </div>
        
        <Progress 
          value={percentage} 
          className={cn(
            "h-2",
            completed ? "[&>div]:bg-green-500" : "[&>div]:bg-orange-500"
          )} 
        />
        
        <p className="text-xs text-muted-foreground">
          {completed 
            ? "오늘 필요한 업무 시간을 모두 채웠습니다! 👏" 
            : `목표 달성까지 ${Math.max(required_hours - total_hours, 0).toFixed(1)}시간 남았습니다.`}
        </p>
      </CardContent>
    </Card>
  );
};

export default TodayWorkStatusWidget;
