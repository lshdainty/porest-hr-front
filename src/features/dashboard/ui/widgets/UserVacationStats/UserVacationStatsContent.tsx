import { Card, CardContent } from '@/shared/ui/shadcn/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/shadcn/table'
import { type GetAllUsersVacationSummaryResp } from '@/entities/vacation'
import { useTranslation } from 'react-i18next'

interface UserVacationStatsContentProps {
  data: GetAllUsersVacationSummaryResp[]
}

export const UserVacationStatsContent = ({ data }: UserVacationStatsContentProps) => {
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
            {data.map((user) => (
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
