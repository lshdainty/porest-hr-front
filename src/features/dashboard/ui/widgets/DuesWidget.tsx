import QueryAsyncBoundary from '@/shared/ui/async-boundary/QueryAsyncBoundary'
import { DuesTableContent } from '@/features/culture-dues/ui/DuesTableContent'
import { DuesTableSkeleton } from '@/features/culture-dues/ui/DuesTableSkeleton'
import { useYearDuesQuery } from '@/entities/dues'
import { useMemo, useState } from 'react'

export const DuesWidget = () => {
  const currentYear = new Date().getFullYear()
  const [currentPage, setCurrentPage] = useState(1)

  const { data: yearDues, isLoading, error } = useYearDuesQuery(currentYear)

  const data = useMemo(() => {
    return yearDues?.map((dues) => ({
      ...dues,
      id: dues.dues_id.toString(),
    })) || []
  }, [yearDues])

  return (
    <QueryAsyncBoundary
      queryState={{ isLoading, error, data: yearDues }}
      loadingComponent={<DuesTableSkeleton />}
    >
      <DuesTableContent
        data={data}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        rowsPerPage={5}
        showPagination={false}
        stickyHeader={true}
        className='h-full'
      />
    </QueryAsyncBoundary>
  )
}
