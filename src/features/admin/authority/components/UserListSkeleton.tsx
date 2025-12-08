import { ScrollArea } from '@/components/shadcn/scrollArea';
import { Skeleton } from '@/components/shadcn/skeleton';

const UserListSkeleton = () => {
  return (
    <div className="flex flex-col h-full border-r">
      <div className="p-4 border-b space-y-3 bg-muted/30">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-9 w-full" />
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {Array.from({ length: 10 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col p-3 rounded-md gap-1"
            >
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-36" />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export { UserListSkeleton };
