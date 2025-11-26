import { toast } from '@/components/alert/toast';
import { Button } from '@/components/shadcn/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/shadcn/dialog';
import { Input } from '@/components/shadcn/input';
import { Label } from '@/components/shadcn/label';
import { useUnregisteredWorkHistoryExcelDownloadMutation } from '@/hooks/queries/useWorks';
import dayjs from 'dayjs';
import { useState } from 'react';

interface UnregisteredDownloadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UnregisteredDownloadDialog = ({ open, onOpenChange }: UnregisteredDownloadDialogProps) => {
  const [downloadYear, setDownloadYear] = useState(dayjs().year());
  const [downloadMonth, setDownloadMonth] = useState(dayjs().month() + 1);
  const downloadUnregisteredWorkHistoryExcel = useUnregisteredWorkHistoryExcelDownloadMutation();

  const handleConfirmUnregisteredDownload = async () => {
    try {
      const blob = await downloadUnregisteredWorkHistoryExcel.mutateAsync({
        year: downloadYear,
        month: downloadMonth
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `미등록_업무시간_${downloadYear}년_${downloadMonth}월_${dayjs().format('YYYYMMDD')}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      onOpenChange(false);
    } catch (error) {
      console.error('미등록 리스트 다운로드 실패:', error);
      toast.error('미등록 리스트 다운로드에 실패했습니다.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>미등록 업무 시간 다운로드</DialogTitle>
          <DialogDescription>
            다운로드할 연도와 월을 선택해주세요.
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='year' className='text-right'>
              연도
            </Label>
            <Input
              id='year'
              type='number'
              value={downloadYear}
              onChange={(e) => setDownloadYear(Number(e.target.value))}
              className='col-span-3'
              min={2000}
              max={2100}
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='month' className='text-right'>
              월
            </Label>
            <Input
              id='month'
              type='number'
              value={downloadMonth}
              onChange={(e) => setDownloadMonth(Number(e.target.value))}
              className='col-span-3'
              min={1}
              max={12}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type='button'
            variant='outline'
            onClick={() => onOpenChange(false)}
          >
            취소
          </Button>
          <Button
            type='button'
            onClick={handleConfirmUnregisteredDownload}
            disabled={downloadUnregisteredWorkHistoryExcel.isPending}
          >
            {downloadUnregisteredWorkHistoryExcel.isPending ? '다운로드 중...' : '다운로드'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UnregisteredDownloadDialog;
