import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useMemo } from 'react';

import { Card, CardContent } from '@/components/shadcn/card';

import { useSystemCheckStatusQuery, useSystemTypesQuery, useToggleSystemCheckMutation } from '@/hooks/queries/useWorks';
import { SystemType } from '@/lib/api/work';
import { cn } from '@/lib/utils';

interface SystemItem {
  id: SystemType;
  name: string;
  description: string;
  checked?: boolean;
}

const SystemCheckWidget = () => {
  const { data: systemTypes } = useSystemTypesQuery();
  
  const systemCodes = useMemo(() => {
    if (!systemTypes) return [];
    return systemTypes.map(type => type.code as SystemType);
  }, [systemTypes]);

  const { data: statusData, refetch } = useSystemCheckStatusQuery(systemCodes);

  const sortedSystems = useMemo(() => {
    if (!systemTypes) return [];
    
    return [...systemTypes]
      .sort((a, b) => (a.order_seq || 0) - (b.order_seq || 0))
      .map(type => {
        const status = statusData?.statuses.find(s => s.system_code === type.code);
        return {
          id: type.code as SystemType,
          name: type.name,
          description: `${type.name} Check`,
          checked: status?.checked ?? false
        };
      });
  }, [systemTypes, statusData]);

  return (
    <Card className="h-full flex flex-col border-none shadow-none py-0 min-h-[200px]">

      <CardContent className="flex-1 p-0 min-h-0">
        <div className="h-full overflow-y-auto">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-2 p-2">
            {sortedSystems.map((system) => (
              <SystemRow key={system.id} system={system} onToggle={() => refetch()} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const SystemRow = ({ system, onToggle }: { system: SystemItem; onToggle: () => void }) => {
  const { mutate: toggleCheck, isPending } = useToggleSystemCheckMutation();

  const handleCheck = () => {
    if (isPending) return;
    toggleCheck({ system_code: system.id }, {
      onSuccess: () => {
        onToggle();
      }
    });
  };

  return (
    <div
      onClick={handleCheck}
      className={cn(
        "group flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer hover:shadow-md",
        system.checked
          ? "bg-green-50/50 border-green-200 dark:bg-green-900/10 dark:border-green-900"
          : "bg-orange-50/50 border-orange-200 hover:bg-orange-100/50 hover:border-orange-300 dark:bg-orange-900/10 dark:border-orange-900 dark:hover:bg-orange-900/20",
        isPending && "opacity-50 cursor-wait"
      )}
    >
      <div className="flex flex-col gap-1">
        <span className={cn(
          "font-medium text-sm transition-colors",
          system.checked 
            ? "text-green-700 dark:text-green-400" 
            : "text-orange-700 dark:text-orange-400"
        )}>
          {system.name}
        </span>
        <span className={cn(
          "text-xs",
          system.checked
            ? "text-muted-foreground"
            : "text-orange-600/80 dark:text-orange-400/80"
        )}>
          {system.description}
        </span>
      </div>
      <div className="flex items-center gap-3">
        {system.checked ? (
          <CheckCircle2 className="h-5 w-5 text-green-500 animate-in zoom-in duration-200" />
        ) : (
          <AlertCircle className="h-5 w-5 text-orange-500 animate-pulse group-hover:scale-110 transition-transform" />
        )}
      </div>
    </div>
  );
};

export default SystemCheckWidget;
