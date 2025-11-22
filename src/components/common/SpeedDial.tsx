import { Button } from '@/components/shadcn/button';
import { cn } from '@/lib/utils';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';

export interface SpeedDialAction {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  className?: string;
}

interface SpeedDialProps {
  actions: SpeedDialAction[];
  mainIcon?: React.ReactNode;
  activeIcon?: React.ReactNode;
  isOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
  className?: string;
}

export function SpeedDial({
  actions,
  mainIcon = <Plus className="h-6 w-6" />,
  activeIcon = <X className="h-6 w-6" />,
  isOpen: controlledIsOpen,
  onToggle,
  className,
}: SpeedDialProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const handleToggle = () => {
    if (isControlled) {
      onToggle?.(!isOpen);
    } else {
      setInternalIsOpen(!isOpen);
    }
  };

  return (
    <div className={cn("fixed bottom-8 right-8 z-50 flex items-end justify-end", className)}>
      {/* Actions Menu - Origin at the center of the main button (28px from bottom/right) */}
      <div className="absolute bottom-[28px] right-[28px] w-0 h-0 flex items-center justify-center">
        {actions.map((action, index) => {
          // Calculate position on a quarter circle (90 degrees)
          const total = actions.length;
          // If 1 item: 0 (up)
          // If 2 items: 0, 90
          // If 3 items: 0, 45, 90
          const step = total > 1 ? 90 / (total - 1) : 0;
          const angle = total === 1 ? 0 : index * step; // 0 is up, 90 is left
          
          // Radius = 80px
          const radius = 80;
          const itemRadius = 24; // Half of item size (48px)
          
          const radian = (angle * Math.PI) / 180;
          // Calculate center position then subtract item radius to center the item
          const bottom = Math.round(radius * Math.cos(radian)) - itemRadius;
          const right = Math.round(radius * Math.sin(radian)) - itemRadius;

          return (
            <div 
              key={action.label} 
              className={cn(
                "absolute transition-all duration-300 ease-out",
                isOpen ? "opacity-100 scale-100" : "opacity-0 scale-50 pointer-events-none"
              )}
              style={{ 
                bottom: isOpen ? `${bottom}px` : `-${itemRadius}px`,
                right: isOpen ? `${right}px` : `-${itemRadius}px`,
                transitionDelay: isOpen ? `${index * 50}ms` : '0ms' 
              }}
            >
              <Button
                size="icon"
                variant={action.variant || "default"}
                onClick={() => {
                  action.onClick();
                  if (!isControlled) setInternalIsOpen(false);
                }}
                className={cn(
                  "h-12 w-12 rounded-full shadow-lg transition-transform hover:scale-110", 
                  action.className
                )}
                title={action.label}
              >
                {action.icon}
              </Button>
            </div>
          );
        })}
      </div>

      {/* Main Toggle Button */}
      <Button
        size="icon"
        className={cn(
          "h-14 w-14 rounded-full shadow-xl transition-all duration-300 hover:scale-105 z-50 relative",
          isOpen ? "bg-gray-800 hover:bg-gray-900 rotate-90" : "bg-primary hover:bg-primary/90"
        )}
        onClick={handleToggle}
      >
        <div className="relative flex items-center justify-center">
          <div className={cn("absolute transition-opacity duration-200", isOpen ? "opacity-0" : "opacity-100")}>
            {mainIcon}
          </div>
          <div className={cn("absolute transition-opacity duration-200", isOpen ? "opacity-100" : "opacity-0")}>
            {activeIcon}
          </div>
        </div>
      </Button>
    </div>
  );
}
