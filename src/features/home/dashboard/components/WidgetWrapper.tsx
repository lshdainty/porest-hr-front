import { cn } from '@/lib/utils';
import { GripHorizontal, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface WidgetWrapperProps extends React.ComponentProps<'div'> {
  title: string;
  onClose: () => void;
  isEditing: boolean;
}

const WidgetWrapper = ({ children, title, onClose, isEditing, className, ...props }: WidgetWrapperProps) => {
  const { t } = useTranslation('dashboard');
  return (
    <div className={`bg-card text-card-foreground rounded-xl shadow-sm border flex flex-col overflow-hidden h-full ${className}`} {...props}>
      <div className={cn(
        'p-3 border-b flex justify-between items-center select-none z-10 group',
        isEditing ? 'drag-handle cursor-move' : ''
      )}>
        <h3 className='font-semibold text-sm flex items-center gap-2'>
          {isEditing && <GripHorizontal className='w-4 h-4 text-muted-foreground' />}
          {title}
        </h3>
        {isEditing && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            className='text-muted-foreground hover:text-destructive transition-colors'
            title={t('hideWidget')}
          >
            <X className='w-4 h-4' />
          </button>
        )}
      </div>
      <div className='flex-1 overflow-auto p-0 relative'>
        {children}
      </div>
    </div>
  );
};

export default WidgetWrapper;
