import { Skeleton } from "@/shared/ui/shadcn/skeleton";

const UserRoleAssignmentSkeleton = () => {
  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b bg-background">
        <div className="mb-1">
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-4 w-48 mb-4" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-28" />
        </div>
      </div>

      <div className="p-6">
        <Skeleton className="h-5 w-12 mb-2" />
        <Skeleton className="h-4 w-64 mb-3" />
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="flex items-center gap-1.5 rounded-xl border py-4 pl-5 pr-4">
              <div className="flex flex-1 flex-col gap-1.5">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-3/4" />
              </div>
              <Skeleton className="size-5 shrink-0" />
            </div>
          ))}
        </div>
        <div className="mt-3 flex justify-end">
          <Skeleton className="h-9 w-16" />
        </div>
      </div>
    </div>
  );
};

export { UserRoleAssignmentSkeleton };
