import { Skeleton } from '@/components/shadcn/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shadcn/table'
import { useTranslation } from 'react-i18next'

export const VacationHistorySkeleton = () => {
  const { t } = useTranslation('vacation')

  return (
    <div className="h-full overflow-auto">
      <Table className="min-w-[800px]">
        <TableHeader className="sticky top-0 bg-background z-10">
          <TableRow>
            <TableHead className="min-w-[200px] pl-4">{t('history.tableDate')}</TableHead>
            <TableHead className="min-w-[150px]">{t('history.vacationType')}</TableHead>
            <TableHead className="min-w-[300px]">{t('history.tableReason')}</TableHead>
            <TableHead className="min-w-[80px] pr-4"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, i) => (
            <TableRow key={i}>
              <TableCell className="pl-4">
                <Skeleton className="h-4 w-32" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-48" />
              </TableCell>
              <TableCell className="pr-4">
                <div className="flex justify-end">
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
