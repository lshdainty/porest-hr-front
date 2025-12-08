import { Skeleton } from '@/components/shadcn/skeleton';

const DepartmentTreePanelSkeleton = () => {
  const TreeNodeSkeleton = ({ level = 0, hasChildren = true }: { level?: number; hasChildren?: boolean }) => (
    <div className='space-y-2'>
      <div 
        className='flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg'
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        <div className='flex items-center space-x-2 flex-1'>
          {/* Expand/Collapse Arrow */}
          {hasChildren && <Skeleton className='h-4 w-4' />}
          
          {/* Icon */}
          <Skeleton className='h-4 w-4' />
          
          {/* Department Name */}
          <Skeleton className='h-4 w-24' />
        </div>

        {/* Action Buttons */}
        <div className='flex space-x-1 items-center'>
          <Skeleton className='h-6 w-6 rounded' />
          <Skeleton className='h-6 w-6 rounded' />
          <Skeleton className='h-6 w-6 rounded' />
        </div>
      </div>

      {/* Child nodes */}
      {hasChildren && level < 2 && (
        <div className='space-y-1'>
          <TreeNodeSkeleton level={level + 1} hasChildren={level < 1} />
          <TreeNodeSkeleton level={level + 1} hasChildren={false} />
          {level === 0 && <TreeNodeSkeleton level={level + 1} hasChildren={true} />}
        </div>
      )}
    </div>
  );

  return (
    <div className='h-full flex flex-col'>
      {/* Header Skeleton */}
      <div className='flex items-center justify-between p-4 border-b'>
        <Skeleton className='h-6 w-20' />
        <div className='flex items-center space-x-2'>
          <Skeleton className='h-4 w-4' />
          <Skeleton className='h-8 w-20 rounded' />
        </div>
      </div>

      {/* Tree Content Skeleton */}
      <div className='flex-1 p-4 overflow-y-auto'>
        <div className='space-y-1'>
          {/* Root level departments */}
          {Array.from({ length: 3 }).map((_, index) => (
            <TreeNodeSkeleton key={index} level={0} hasChildren={true} />
          ))}
        </div>
      </div>

      {/* Dialog Skeleton (when dialog might be open) */}
      <div className='hidden'>
        {/* This represents the potential dialog content skeleton */}
        <div className='space-y-4 p-6'>
          <Skeleton className='h-6 w-32' />
          <div className='space-y-2'>
            <Skeleton className='h-4 w-16' />
            <Skeleton className='h-10 w-full' />
          </div>
          <div className='space-y-2'>
            <Skeleton className='h-4 w-20' />
            <Skeleton className='h-10 w-full' />
          </div>
          <div className='space-y-2'>
            <Skeleton className='h-4 w-12' />
            <Skeleton className='h-24 w-full' />
          </div>
          <div className='flex space-x-2 justify-end'>
            <Skeleton className='h-10 w-16' />
            <Skeleton className='h-10 w-16' />
          </div>
        </div>
      </div>
    </div>
  )
}

export { DepartmentTreePanelSkeleton }
