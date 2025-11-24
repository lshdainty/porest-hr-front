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
      id: dues.dues_seq.toString(),
    })) || [];
  }, [yearDues]);

  return (
    <div className='h-full w-full p-4'>
      <DuesTableContent
        data={data}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        rowsPerPage={5}
      />
    </div>
  );
};

export default DuesWidget;
