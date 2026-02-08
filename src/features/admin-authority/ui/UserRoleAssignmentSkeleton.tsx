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
        <Skeleton className="h-6 w-28 mb-4" />
        <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg bg-card gap-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-28" />
            </div>
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-[200px]" />
        </div>
      </div>
    </div>
  );
};

export { UserRoleAssignmentSkeleton };
