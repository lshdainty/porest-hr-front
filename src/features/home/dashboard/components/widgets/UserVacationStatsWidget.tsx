import QueryAsyncBoundary from "@/components/common/QueryAsyncBoundary"
import { Card, CardContent } from "@/components/shadcn/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn/table"
import EmptyVacationStats from "@/features/home/dashboard/components/widgets/EmptyVacationStats"
import UserVacationStatsWidgetSkeleton from "@/features/home/dashboard/components/widgets/UserVacationStatsWidgetSkeleton"
import { useAllUsersVacationSummaryQuery } from "@/hooks/queries/useVacations"
import { useTranslation } from "react-i18next"

const UserVacationStatsWidget = () => {
  const { t } = useTranslation('vacation')
  const currentYear = new Date().getFullYear()
  const { data: vacationSummaries, isLoading, error } = useAllUsersVacationSummaryQuery(currentYear)

  return (
    <QueryAsyncBoundary
      queryState={{ isLoading, error, data: vacationSummaries }}
      loadingComponent={<UserVacationStatsWidgetSkeleton />}
      emptyComponent={
        <Card className="h-full flex flex-col border-none shadow-none py-0">
          <CardContent className="flex-1 flex items-center justify-center p-0">
            <EmptyVacationStats />
          </CardContent>
        </Card>
      }
      isEmpty={(data) => !data || data.length === 0}
    >
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
            {vacationSummaries?.map((user) => (
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
    </QueryAsyncBoundary>
  )
}

export default UserVacationStatsWidget
