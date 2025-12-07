import { Card, CardContent } from '@/components/shadcn/card';
import { Skeleton } from '@/components/shadcn/skeleton';

const SystemCheckWidgetSkeleton = () => {
  return (
    <Card className="h-full flex flex-col border-none shadow-none py-0 min-h-[200px]">
      <CardContent className="flex-1 p-0 min-h-0">
        <div className="h-full overflow-y-auto">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-2 p-2">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-5 w-5 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemCheckWidgetSkeleton;
