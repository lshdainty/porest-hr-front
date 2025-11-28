import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shadcn/tabs';
import { WorkCodeProvider } from '../contexts/WorkCodeContext';
import WorkCodeList from './WorkCodeList';
import WorkDivisionList from './WorkDivisionList';

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

        <Tabs defaultValue="part" className="space-y-4">
          <TabsList>
            <TabsTrigger value="part">업무 파트</TabsTrigger>
            <TabsTrigger value="division">업무 구분</TabsTrigger>
          </TabsList>
          
          <TabsContent value="part">
            <Card>
              <CardHeader>
                <CardTitle>업무 파트 목록</CardTitle>
              </CardHeader>
              <CardContent>
                <WorkCodeList />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="division">
            <Card>
              <CardHeader>
                <CardTitle>업무 구분 목록</CardTitle>
              </CardHeader>
              <CardContent>
                <WorkDivisionList />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </WorkCodeProvider>
  );
};

export default WorkCodeContent;
