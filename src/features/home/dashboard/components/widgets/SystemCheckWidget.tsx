import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useMemo } from 'react';

import { Card, CardContent } from '@/components/shadcn/card';
import { ScrollArea } from '@/components/shadcn/scrollArea';
import { useSystemCheckStatusQuery, useSystemTypesQuery, useToggleSystemCheckMutation } from '@/hooks/queries/useWorks';
import { SystemType } from '@/lib/api/work';
import { cn } from '@/lib/utils';

interface SystemItem {
  id: SystemType;
  name: string;
  description: string;
}

const SystemCheckWidget = () => {
  const { data: systemTypes } = useSystemTypesQuery();

  const sortedSystems = useMemo(() => {
    if (!systemTypes) return [];
    
    return [...systemTypes]
      .sort((a, b) => (a.order_seq || 0) - (b.order_seq || 0))
      .map(type => ({
        id: type.code as SystemType,
        name: type.name,
        description: `${type.name} Check` // Description might need to be dynamic or removed if not available
      }));
  }, [systemTypes]);

  return (
    <Card className="h-full flex flex-col border-none shadow-none py-0">

      <CardContent className="flex-1 p-0 min-h-0">
        <ScrollArea className="h-full">
          <div className="grid grid-cols-2 gap-2 p-2 min-w-[300px]">
            {sortedSystems.map((system) => (
              <SystemRow key={system.id} system={system} />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

const SystemRow = ({ system }: { system: SystemItem }) => {
  const { data: statusData, refetch } = useSystemCheckStatusQuery(system.id);
  const { mutate: toggleCheck, isPending } = useToggleSystemCheckMutation();

  const isChecked = statusData?.checked ?? false;

  const handleCheck = () => {
    if (isPending) return;
    toggleCheck({ system_code: system.id }, {
      onSuccess: () => {
        refetch();
      }
    });
  };

  return (
    <div
      onClick={handleCheck}
      className={cn(
        "group flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer hover:shadow-md",
        isChecked
          ? "bg-green-50/50 border-green-200 dark:bg-green-900/10 dark:border-green-900"
          : "bg-orange-50/50 border-orange-200 hover:bg-orange-100/50 hover:border-orange-300 dark:bg-orange-900/10 dark:border-orange-900 dark:hover:bg-orange-900/20",
        isPending && "opacity-50 cursor-wait"
      )}
    >
      <div className="flex flex-col gap-1">
        <span className={cn(
          "font-medium text-sm transition-colors",
          isChecked 
            ? "text-green-700 dark:text-green-400" 
            : "text-orange-700 dark:text-orange-400"
        )}>
          {system.name}
        </span>
        <span className={cn(
          "text-xs",
          isChecked
            ? "text-muted-foreground"
            : "text-orange-600/80 dark:text-orange-400/80"
        )}>
          {system.description}
        </span>
      </div>
      <div className="flex items-center gap-3">
        {isChecked ? (
          <CheckCircle2 className="h-5 w-5 text-green-500 animate-in zoom-in duration-200" />
        ) : (
          <AlertCircle className="h-5 w-5 text-orange-500 animate-pulse group-hover:scale-110 transition-transform" />
        )}
      </div>
    </div>
  );
};

export default SystemCheckWidget;
