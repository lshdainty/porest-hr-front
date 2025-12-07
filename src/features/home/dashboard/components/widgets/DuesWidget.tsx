import DuesTableContent from '@/features/culture/dues/components/DuesTableContent';
import { GetYearDuesResp } from '@/lib/api/dues';
import { useMemo, useState } from 'react';

interface DuesWidgetProps {
  yearDues?: GetYearDuesResp[];
}

const DuesWidget = ({ yearDues }: DuesWidgetProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  const data = useMemo(() => {
    return yearDues?.map((dues) => ({
      ...dues,
      id: dues.dues_id.toString(),
    })) || [];
  }, [yearDues]);

  return (
    <DuesTableContent
      data={data}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      rowsPerPage={5}
      showPagination={false}
      stickyHeader={true}
      className='h-full'
    />
  );
};

export default DuesWidget;
