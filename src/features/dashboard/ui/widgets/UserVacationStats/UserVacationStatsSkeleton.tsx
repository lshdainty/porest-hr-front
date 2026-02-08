import { Card, CardContent } from '@/shared/ui/shadcn/card'
import { Skeleton } from '@/shared/ui/shadcn/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/shadcn/table'
import { useTranslation } from 'react-i18next'

export const UserVacationStatsSkeleton = () => {
  const { t } = useTranslation('vacation')

  return (
    <Card className="h-full flex flex-col border-none shadow-none py-0">
      <CardContent className="flex-1 overflow-hidden p-0">
        <Table wrapperClassName="h-full overflow-auto">
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              <TableHead className="w-[80px] whitespace-nowrap">{t('history.tableName')}</TableHead>
              <TableHead className="min-w-[100px] whitespace-nowrap">{t('history.tableDepartment')}</TableHead>
              <TableHead className="text-right min-w-[80px] whitespace-nowrap">{t('history.tableTotalAnnual')}</TableHead>
              <TableHead className="text-right min-w-[80px] whitespace-nowrap">{t('history.tableUsed')}</TableHead>
              <TableHead className="text-right min-w-[80px] whitespace-nowrap">{t('history.tableScheduled')}</TableHead>
              <TableHead className="text-right min-w-[80px] whitespace-nowrap">{t('history.tableRemaining')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-4 w-10 ml-auto" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-4 w-10 ml-auto" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-4 w-10 ml-auto" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-4 w-10 ml-auto" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
