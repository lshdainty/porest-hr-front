import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shadcn/tabs';
import { Briefcase } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { WorkCodeProvider } from '../contexts/WorkCodeContext';
import WorkCodeList from './WorkCodeList';
import WorkDivisionList from './WorkDivisionList';

const WorkCodeContent = () => {
  const { t } = useTranslation('work');

  return (
    <WorkCodeProvider>
      <div className='h-full w-full'>
        <div className='h-full flex flex-col p-4 sm:p-6 md:p-8 gap-6 overflow-hidden'>
          <div className='flex items-center gap-2 flex-shrink-0'>
            <Briefcase />
            <h1 className='text-3xl font-bold'>{t('codeManagement')}</h1>
          </div>

          <Tabs defaultValue="part" className="flex-1 min-h-0 flex flex-col">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="part">{t('workPart')}</TabsTrigger>
              <TabsTrigger value="division">{t('workDivision')}</TabsTrigger>
            </TabsList>

            <TabsContent value="part" className="flex-1 min-h-0 mt-2 border rounded-lg overflow-hidden">
              <div className="h-full overflow-y-auto p-4">
                <WorkCodeList />
              </div>
            </TabsContent>

            <TabsContent value="division" className="flex-1 min-h-0 mt-2 border rounded-lg overflow-hidden">
              <div className="h-full overflow-y-auto p-4">
                <WorkDivisionList />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </WorkCodeProvider>
  );
};

export default WorkCodeContent;
