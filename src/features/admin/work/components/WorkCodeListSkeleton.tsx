import { Skeleton } from '@/components/shadcn/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/shadcn/table';
import { useTranslation } from 'react-i18next';

const WorkCodeListSkeleton = () => {
  const { t } = useTranslation('work');

  return (
    <div className="space-y-4">
      <div className="rounded-md border overflow-x-auto">
        <Table className="min-w-[800px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">{t('codeName')}</TableHead>
              <TableHead>{t('code')}</TableHead>
              <TableHead>{t('type')}</TableHead>
              <TableHead>{t('order')}</TableHead>
              <TableHead className="text-right">{t('manage')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 3 }).map((_, groupIndex) => (
              <>
                <TableRow key={`group-${groupIndex}`} className="bg-muted/50">
                  <TableCell className="pl-4">
                    <Skeleton className="h-5 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-8" />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </TableCell>
                </TableRow>
                {Array.from({ length: 2 }).map((_, partIndex) => (
                  <TableRow key={`part-${groupIndex}-${partIndex}`}>
                    <TableCell className="pl-12">
                      <Skeleton className="h-4 w-28" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-8" />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export { WorkCodeListSkeleton };
