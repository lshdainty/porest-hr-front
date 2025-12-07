import { Card, CardContent } from "@/components/shadcn/card"
import { Skeleton } from "@/components/shadcn/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn/table"
import { useAllUsersVacationSummaryQuery } from "@/hooks/queries/useVacations"
import { useTranslation } from "react-i18next"

const UserVacationStatsWidget = () => {
  const { t } = useTranslation('vacation')
  const currentYear = new Date().getFullYear()
  const { data: vacationSummaries, isLoading } = useAllUsersVacationSummaryQuery(currentYear)

  if (isLoading) {
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

  if (!vacationSummaries || vacationSummaries.length === 0) {
    return (
      <Card className="h-full flex flex-col border-none shadow-none py-0">
        <CardContent className="flex-1 flex items-center justify-center p-0">
          <p className="text-muted-foreground text-sm">{t('history.noDataMessage')}</p>
        </CardContent>
      </Card>
    )
  }

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
            {vacationSummaries.map((user) => (
              <TableRow key={user.user_id}>
                <TableCell className="font-medium whitespace-nowrap">{user.user_name}</TableCell>
                <TableCell className="whitespace-nowrap">{user.department_name}</TableCell>
                <TableCell className="text-right whitespace-nowrap">{user.total_vacation_days_str}</TableCell>
                <TableCell className="text-right whitespace-nowrap">{user.used_vacation_days_str}</TableCell>
                <TableCell className="text-right whitespace-nowrap">{user.scheduled_vacation_days_str}</TableCell>
                <TableCell className="text-right font-bold text-primary whitespace-nowrap">{user.remaining_vacation_days_str}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default UserVacationStatsWidget
