import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card';
import { WorkCodeProvider } from '../contexts/WorkCodeContext';
import WorkCodeList from './WorkCodeList';

const WorkCodeContent = () => {
  return (
    <WorkCodeProvider>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">업무 코드 관리</h2>
          <p className="text-muted-foreground">
            업무 그룹 및 상세 코드를 관리합니다.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>코드 목록</CardTitle>
          </CardHeader>
          <CardContent>
            <WorkCodeList />
          </CardContent>
        </Card>
      </div>
    </WorkCodeProvider>
  );
};

export default WorkCodeContent;
