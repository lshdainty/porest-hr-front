import { ScrollArea } from '@/components/shadcn/scrollArea';
import { Skeleton } from '@/components/shadcn/skeleton';

const UserListSkeleton = () => {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <Skeleton className="h-6 w-24" />
      </div>
      <div className="p-2 border-b">
        <Skeleton className="h-9 w-full" />
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 rounded-lg mb-1"
            >
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default UserListSkeleton;
