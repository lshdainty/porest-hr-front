import { cn } from '@/lib/utils';
import { GripHorizontal, X } from 'lucide-react';

interface WidgetWrapperProps extends React.ComponentProps<'div'> {
  title: string;
  onClose: () => void;
  isEditing: boolean;
}

const WidgetWrapper = ({ children, title, onClose, isEditing, className, ...props }: WidgetWrapperProps) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden h-full ${className}`} {...props}>
      <div className={cn(
        'p-3 bg-gray-50 border-b border-gray-100 flex justify-between items-center select-none z-10 group',
        isEditing ? 'drag-handle cursor-move' : ''
      )}>
        <h3 className='font-semibold text-gray-700 text-sm flex items-center gap-2'>
          {isEditing && <GripHorizontal className='w-4 h-4 text-gray-400' />}
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
            className='text-gray-400 hover:text-red-500 transition-colors'
            title='위젯 숨기기'
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
