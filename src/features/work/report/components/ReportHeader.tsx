import { Badge } from '@/components/shadcn/badge';
import { Button } from '@/components/shadcn/button';
import { cn } from '@/lib/utils';
import {
  ChevronDown,
  Download,
  FileDown,
  FileUp,
  Filter,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useReportContext } from '@/features/work/report/contexts/ReportContext';

interface ReportHeaderProps {
  handleExcelImport: () => void;
  handleExcelExport: () => void;
  handleDownloadTemplate: () => void;
  handleDownloadUnregistered: () => void;
}

const ReportHeader = ({
  handleExcelImport,
  handleExcelExport,
  handleDownloadTemplate,
  handleDownloadUnregistered,
}: ReportHeaderProps) => {
  const { t } = useTranslation('work');
  const {
    isFilterOpen,
    setIsFilterOpen,
    activeFiltersCount,
  } = useReportContext();
  return (
    <>
      <h1 className='text-3xl font-bold mb-6'>{t('report.pageTitle')}</h1>

      {/* 필터 및 액션 영역 */}
      <div className='mb-6 space-y-4'>
        {/* 필터 토글 및 엑셀 버튼 영역 */}
        <div className='flex flex-wrap items-center gap-2'>
          {/* 필터 버튼 */}
          <Button
            variant={isFilterOpen ? 'default' : 'outline'}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className='relative'
          >
            <Filter className='w-4 h-4 mr-2' />
            {t('report.filter')}
            {activeFiltersCount > 0 && (
              <Badge
                variant='secondary'
                className='ml-2 h-5 min-w-5 rounded-full px-1 text-xs'
              >
                {activeFiltersCount}
              </Badge>
            )}
            <ChevronDown
              className={cn(
                'w-4 h-4 ml-2 transition-transform',
                isFilterOpen && 'rotate-180'
              )}
            />
          </Button>

          {/* 구분선 */}
          <div className='h-8 w-px bg-border' />

          {/* 엑셀 관련 버튼들 */}
          <Button variant='outline' onClick={handleExcelImport}>
            <FileUp className='w-4 h-4 mr-2' />
            {t('report.excelImportBtn')}
          </Button>

          <Button variant='outline' onClick={handleExcelExport}>
            <FileDown className='w-4 h-4 mr-2' />
            {t('report.excelExportBtn')}
          </Button>

          <Button variant='outline' onClick={handleDownloadTemplate}>
            <Download className='w-4 h-4 mr-2' />
            {t('report.downloadTemplate')}
          </Button>

          <Button variant='outline' onClick={handleDownloadUnregistered}>
            <Download className='w-4 h-4 mr-2' />
            {t('report.downloadUnregistered')}
          </Button>
        </div>
      </div>
    </>
  );
}

export { ReportHeader }
