import { Card, CardContent } from '@/components/shadcn/card';
import { Skeleton } from '@/components/shadcn/skeleton';

const VacationPolicyListsSkeleton = () => {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index} className="transition-all">
          <CardContent className="p-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex flex-col gap-3 flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <Skeleton className="h-6 w-48" />
                  <div className="flex flex-wrap items-center gap-2">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                </div>
                <Skeleton className="h-4 w-3/4" />
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-28" />
                </div>
                <Skeleton className="h-4 w-40" />
              </div>
              <Skeleton className="h-8 w-8 self-end sm:self-auto" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export { VacationPolicyListsSkeleton };
