import { Card, CardContent } from "@/components/shadcn/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn/table";

interface UserVacationStat {
  id: string;
  name: string;
  department: string;
  total: string;
  remaining: string;
  scheduled: string;
  used: string;
}

const MOCK_DATA: UserVacationStat[] = [
  { id: '1', name: '김철수', department: '개발팀', total: '15일', remaining: '5일', scheduled: '2일', used: '8일' },
  { id: '2', name: '이영희', department: '디자인팀', total: '15일', remaining: '10일', scheduled: '0일', used: '5일' },
  { id: '3', name: '박민수', department: '기획팀', total: '20일', remaining: '12일 4시간', scheduled: '3일', used: '5일' },
  { id: '4', name: '최지은', department: '인사팀', total: '15일', remaining: '2일', scheduled: '1일', used: '12일' },
  { id: '5', name: '정우성', department: '개발팀', total: '15일', remaining: '8일', scheduled: '0일', used: '7일' },
  { id: '6', name: '한지민', department: '마케팅팀', total: '18일', remaining: '15일 2시간', scheduled: '1일', used: '2일' },
  { id: '7', name: '강동원', department: '개발팀', total: '15일', remaining: '0일', scheduled: '0일', used: '15일' },
  { id: '8', name: '송혜교', department: '디자인팀', total: '15일', remaining: '7일 4시간', scheduled: '4시간', used: '7일' },
];

const UserVacationStatsWidget = () => {
  return (
    <Card className="h-full flex flex-col border-none shadow-none py-0">
      <CardContent className="flex-1 overflow-auto p-0">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              <TableHead className="w-[80px] whitespace-nowrap">이름</TableHead>
              <TableHead className="min-w-[100px] whitespace-nowrap">부서</TableHead>
              <TableHead className="text-right min-w-[80px] whitespace-nowrap">총 연차</TableHead>
              <TableHead className="text-right min-w-[80px] whitespace-nowrap">사용</TableHead>
              <TableHead className="text-right min-w-[80px] whitespace-nowrap">예정</TableHead>
              <TableHead className="text-right min-w-[80px] whitespace-nowrap">잔여</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_DATA.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium whitespace-nowrap">{user.name}</TableCell>
                <TableCell className="whitespace-nowrap">{user.department}</TableCell>
                <TableCell className="text-right whitespace-nowrap">{user.total}</TableCell>
                <TableCell className="text-right whitespace-nowrap">{user.used}</TableCell>
                <TableCell className="text-right whitespace-nowrap">{user.scheduled}</TableCell>
                <TableCell className="text-right font-bold text-primary whitespace-nowrap">{user.remaining}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default UserVacationStatsWidget;
