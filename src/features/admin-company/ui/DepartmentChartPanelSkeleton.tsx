import { Skeleton } from '@/shared/ui/shadcn/skeleton';

const DepartmentChartPanelSkeleton = () => {
  return (
    <div className='h-full flex flex-col'>
      {/* Header Skeleton */}
      <div className='flex items-center justify-between p-4 border-b'>
        <Skeleton className='h-6 w-16' />
        <div className='flex items-center space-x-2 h-8'>
          <Skeleton className='h-4 w-4 rounded' />
          <Skeleton className='h-4 w-20' />
        </div>
      </div>

      {/* Chart Skeleton */}
      <div className='flex-1 overflow-auto'>
        <div className='flex justify-center items-center h-full'>
          <div className='org-chart-container'>
            <div className='flex justify-center items-center min-h-[400px] p-4'>
              {/* Root Node */}
              <div className='flex flex-col items-center space-y-8'>
                <div className='p-3  border-2 rounded-lg shadow-sm min-w-[120px] text-center border-blue-200'>
                  <Skeleton className='h-5 w-24 mx-auto' />
                </div>
                
                {/* Connection Lines Skeleton */}
                <div className='flex space-x-4'>
                  <Skeleton className='h-px w-16' />
                  <Skeleton className='h-px w-16' />
                  <Skeleton className='h-px w-16' />
                </div>

                {/* Child Nodes */}
                <div className='flex space-x-8'>
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className='flex flex-col items-center space-y-4'>
                      <div className='p-3  border-2 rounded-lg shadow-sm min-w-[120px] text-center border-blue-200'>
                        <Skeleton className='h-4 w-20 mx-auto' />
                      </div>
                      
                      {/* Sub connection lines */}
                      <div className='flex space-x-2'>
                        <Skeleton className='h-px w-8' />
                        <Skeleton className='h-px w-8' />
                      </div>

                      {/* Sub child nodes */}
                      <div className='flex space-x-4'>
                        {Array.from({ length: 2 }).map((_, subIndex) => (
                          <div key={subIndex} className='p-3  border-2 rounded-lg shadow-sm min-w-[120px] text-center border-blue-200'>
                            <Skeleton className='h-4 w-16 mx-auto' />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { DepartmentChartPanelSkeleton }
