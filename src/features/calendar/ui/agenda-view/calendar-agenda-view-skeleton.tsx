import { Skeleton } from '@/shared/ui/shadcn/skeleton'

const AgendaDayGroupSkeleton = () => {
  return (
    <div className='space-y-3'>
      {/* Date header */}
      <div className='flex items-center gap-3'>
        <Skeleton className='h-10 w-10 rounded-lg' />
        <div className='space-y-1'>
          <Skeleton className='h-4 w-24' />
          <Skeleton className='h-3 w-16' />
        </div>
      </div>

      {/* Events */}
      <div className='ml-[52px] space-y-2'>
        <div className='rounded-lg border p-3 space-y-2'>
          <Skeleton className='h-4 w-3/4' />
          <div className='flex items-center gap-2'>
            <Skeleton className='h-3 w-3 rounded-full' />
            <Skeleton className='h-3 w-20' />
          </div>
          <div className='flex items-center gap-2'>
            <Skeleton className='h-3 w-3 rounded-full' />
            <Skeleton className='h-3 w-32' />
          </div>
        </div>
        <div className='rounded-lg border p-3 space-y-2'>
          <Skeleton className='h-4 w-1/2' />
          <div className='flex items-center gap-2'>
            <Skeleton className='h-3 w-3 rounded-full' />
            <Skeleton className='h-3 w-24' />
          </div>
        </div>
      </div>
    </div>
  )
}

export const CalendarAgendaViewSkeleton = () => {
  return (
    <div className='w-full h-full overflow-hidden'>
      <div className='space-y-6 p-4'>
        {Array.from({ length: 5 }).map((_, i) => (
          <AgendaDayGroupSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
