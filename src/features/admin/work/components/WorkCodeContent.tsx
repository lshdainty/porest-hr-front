import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shadcn/tabs';
import { useTranslation } from 'react-i18next';
import { WorkCodeProvider } from '../contexts/WorkCodeContext';
import WorkCodeList from './WorkCodeList';
import WorkDivisionList from './WorkDivisionList';

const WorkCodeContent = () => {
  const { t } = useTranslation('work');

  return (
    <WorkCodeProvider>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t('codeManagement')}</h2>
          <p className="text-muted-foreground">
            {t('codeManagementDesc')}
          </p>
        </div>

        <Tabs defaultValue="part" className="space-y-4">
          <TabsList>
            <TabsTrigger value="part">{t('workPart')}</TabsTrigger>
            <TabsTrigger value="division">{t('workDivision')}</TabsTrigger>
          </TabsList>

          <TabsContent value="part">
            <Card>
              <CardHeader>
                <CardTitle>{t('workPartList')}</CardTitle>
              </CardHeader>
              <CardContent>
                <WorkCodeList />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="division">
            <Card>
              <CardHeader>
                <CardTitle>{t('workDivisionList')}</CardTitle>
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
