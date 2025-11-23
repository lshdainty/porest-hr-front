import { createContext, ReactNode, useCallback, useContext, useState } from 'react';
import { defaultLayouts, LAYOUT_STORAGE_KEY, WIDGETS, WIDGETS_STORAGE_KEY } from '../constants';

interface DashboardContextType {
  layouts: any;
  activeWidgets: string[];
  isEditing: boolean;
  isToolboxOpen: boolean;
  draggedWidget: any;
  currentBreakpoint: string;
  setLayouts: (layouts: any) => void;
  setActiveWidgets: (widgets: string[]) => void;
  setIsEditing: (isEditing: boolean) => void;
  setIsToolboxOpen: (isOpen: boolean) => void;
  setDraggedWidget: (widget: any) => void;
  setCurrentBreakpoint: (breakpoint: string) => void;
  handleLayoutChange: (layout: any, allLayouts: any) => void;
  handleBreakpointChange: (newBreakpoint: string) => void;
  toggleWidget: (widgetId: string) => void;
  resetLayout: () => void;
  onDrop: (layout: any, layoutItem: any, _event: any) => void;
  handleSave: () => void;
  handleCancel: () => void;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export const useDashboardContext = () => {
  const context = useContext(DashboardContext);
  if (!context) throw new Error('Cannot find DashboardProvider');
  return context;
};

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [layouts, setLayouts] = useState(() => {
    const saved = localStorage.getItem(LAYOUT_STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultLayouts;
  });

  const [activeWidgets, setActiveWidgets] = useState<string[]>(() => {
    const saved = localStorage.getItem(WIDGETS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : WIDGETS.map(w => w.id);
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isToolboxOpen, setIsToolboxOpen] = useState(false);
  const [draggedWidget, setDraggedWidget] = useState<any>(null);
  const [currentBreakpoint, setCurrentBreakpoint] = useState('lg');

  const handleLayoutChange = useCallback((layout: any, allLayouts: any) => {
    setLayouts(allLayouts);
    if (isEditing) {
      localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(allLayouts));
    }
  }, [isEditing]);

  const handleBreakpointChange = useCallback((newBreakpoint: string) => {
    setCurrentBreakpoint(newBreakpoint);
  }, []);

  const toggleWidget = (widgetId: string) => {
    setActiveWidgets(prev => {
      const newWidgets = prev.includes(widgetId)
        ? prev.filter(id => id !== widgetId)
        : [...prev, widgetId];
      
      if (isEditing) {
        localStorage.setItem(WIDGETS_STORAGE_KEY, JSON.stringify(newWidgets));
      }
      return newWidgets;
    });
  };

  const resetLayout = () => {
    setLayouts(defaultLayouts);
    setActiveWidgets(WIDGETS.map(w => w.id));
    localStorage.removeItem(LAYOUT_STORAGE_KEY);
    localStorage.removeItem(WIDGETS_STORAGE_KEY);
  };

  const onDrop = (layout: any, layoutItem: any, _event: any) => {
    if (!draggedWidget) return;

    const newLayouts = {
      ...layouts,
      [currentBreakpoint]: layout
    };
    setLayouts(newLayouts);
    if (isEditing) {
      localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(newLayouts));
    }

    if (!activeWidgets.includes(draggedWidget.id)) {
      const newActiveWidgets = [...activeWidgets, draggedWidget.id];
      setActiveWidgets(newActiveWidgets);
      if (isEditing) {
        localStorage.setItem(WIDGETS_STORAGE_KEY, JSON.stringify(newActiveWidgets));
      }
    }
    
    setDraggedWidget(null);
  };

  const handleSave = () => {
    const dashboardConfig = {
      layouts,
      activeWidgets
    };
    console.log('Dashboard Configuration Saved:', JSON.stringify(dashboardConfig, null, 2));
    setIsToolboxOpen(false);
    // Delay state change to allow SpeedDial to close smoothly
    setTimeout(() => setIsEditing(false), 300);
  };

  const handleCancel = () => {
    const savedLayouts = localStorage.getItem(LAYOUT_STORAGE_KEY);
    const savedWidgets = localStorage.getItem(WIDGETS_STORAGE_KEY);
    
    if (savedLayouts) setLayouts(JSON.parse(savedLayouts));
    else setLayouts(defaultLayouts);
    
    if (savedWidgets) setActiveWidgets(JSON.parse(savedWidgets));
    else setActiveWidgets(WIDGETS.map(w => w.id));

    setIsToolboxOpen(false);
    // Delay state change to allow SpeedDial to close smoothly
    setTimeout(() => setIsEditing(false), 300);
  };

  return (
    <DashboardContext.Provider value={{
      layouts,
      activeWidgets,
      isEditing,
      isToolboxOpen,
      draggedWidget,
      currentBreakpoint,
      setLayouts,
      setActiveWidgets,
      setIsEditing,
      setIsToolboxOpen,
      setDraggedWidget,
      setCurrentBreakpoint,
      handleLayoutChange,
      handleBreakpointChange,
      toggleWidget,
      resetLayout,
      onDrop,
      handleSave,
      handleCancel
    }}>
      {children}
    </DashboardContext.Provider>
  );
};
