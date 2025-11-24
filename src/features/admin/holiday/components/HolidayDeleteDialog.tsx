import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/shadcn/alertDialog';
import { GetHolidaysResp } from '@/lib/api/holiday';
import { TriangleAlert } from 'lucide-react';

interface HolidayDeleteDialogProps {
  holiday: GetHolidaysResp;
  trigger: React.ReactNode;
  onDelete: (holiday_seq: number) => void;
}

const HolidayDeleteDialog = ({ holiday, trigger, onDelete }: HolidayDeleteDialogProps) => {
  const handleDelete = () => {
    if (holiday.holiday_seq) {
      onDelete(holiday.holiday_seq);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent className='sm:max-w-lg'>
        <div className='flex items-start space-x-4'>
          <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20'>
            <TriangleAlert className='h-6 w-6 text-red-600 dark:text-red-400' />
          </div>
          <AlertDialogHeader className='flex-1'>
            <AlertDialogTitle>공휴일 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              정말 "{holiday.holiday_name}" 공휴일을 삭제하시겠습니까? 이 작업은 되돌릴 수 없으며, 공휴일 정보가 영구적으로 삭제됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction variant='destructive' onClick={handleDelete}>
            삭제
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default HolidayDeleteDialog