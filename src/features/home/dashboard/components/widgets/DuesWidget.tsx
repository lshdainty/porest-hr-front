import QueryAsyncBoundary from '@/components/common/QueryAsyncBoundary'
import { DuesTableContent } from '@/features/culture/dues/components/DuesTableContent'
import { DuesTableSkeleton } from '@/features/culture/dues/components/DuesTableSkeleton'
import { useYearDuesQuery } from '@/hooks/queries/useDues'
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
