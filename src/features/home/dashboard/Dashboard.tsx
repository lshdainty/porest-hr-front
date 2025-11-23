import dayjs from 'dayjs';
import { GripHorizontal, GripVertical, Pencil, Plus, Save, Settings, X } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import { useUser } from '@/contexts/UserContext';
import { useUserQuery, useUsersQuery } from '@/hooks/queries/useUsers';
import {
    useAvailableVacationsQuery,
    useUserMonthlyVacationStatsQuery,
    useUserVacationStatsQuery
} from '@/hooks/queries/useVacations';

import ScheduleSkeleton from '@/components/schedule/ScheduleSkeleton';
import ScheduleTable from '@/components/schedule/ScheduleTable';
import UserInfoCard from '@/components/user/UserInfoCard';
import UserInfoCardSkeleton from '@/components/user/UserInfoCardSkeleton';
import MonthVacationStatsCard from '@/features/vacation/history/components/MonthVacationStatsCard';
import MonthVacationStatsCardSkeleton from '@/features/vacation/history/components/MonthVacationStatsCardSkeleton';
import VacationStatsCard from '@/features/vacation/history/components/VacationStatsCard';
import VacationStatsCardSkeleton from '@/features/vacation/history/components/VacationStatsCardSkeleton';
import VacationTypeStatsCard from '@/features/vacation/history/components/VacationTypeStatsCard';
import VacationTypeStatsCardSkeleton from '@/features/vacation/history/components/VacationTypeStatsCardSkeleton';

import QueryAsyncBoundary from '@/components/common/QueryAsyncBoundary';
import { SpeedDial, SpeedDialAction } from '@/components/common/SpeedDial';

import { Button } from '@/components/shadcn/button';
import { cn } from '@/lib/utils';

const ResponsiveGridLayout = WidthProvider(Responsive);

// LocalStorage keys
const LAYOUT_STORAGE_KEY = 'porest-dashboard-layouts';
const WIDGETS_STORAGE_KEY = 'porest-dashboard-widgets';

// Widget Definitions
const WIDGETS = [
  { id: 'profile', label: '내 정보', defaultH: 14, defaultW: 3 },
  { id: 'vacation-stats', label: '휴가 현황', defaultH: 4, defaultW: 3 },
  { id: 'month-stats', label: '월별 휴가 통계', defaultH: 8, defaultW: 6 },
  { id: 'type-stats', label: '휴가 유형별 통계', defaultH: 8, defaultW: 3 },
  { id: 'schedule', label: '근무 일정', defaultH: 8, defaultW: 9 },
];

// Default layouts
const defaultLayouts = {
  lg: [
    { i: 'profile', x: 0, y: 0, w: 3, h: 14 },
    { i: 'vacation-stats', x: 3, y: 0, w: 3, h: 4 },
    { i: 'month-stats', x: 6, y: 0, w: 6, h: 8 },
    { i: 'type-stats', x: 0, y: 4, w: 3, h: 8 },
    { i: 'schedule', x: 3, y: 4, w: 9, h: 8 },
  ],
  md: [
    { i: 'profile', x: 0, y: 0, w: 5, h: 14 },
    { i: 'vacation-stats', x: 5, y: 0, w: 5, h: 4 },
    { i: 'month-stats', x: 0, y: 4, w: 10, h: 8 },
    { i: 'type-stats', x: 0, y: 12, w: 4, h: 8 },
    { i: 'schedule', x: 4, y: 12, w: 6, h: 8 },
  ],
  sm: [
    { i: 'profile', x: 0, y: 0, w: 6, h: 14 },
    { i: 'vacation-stats', x: 0, y: 4, w: 6, h: 4 },
    { i: 'month-stats', x: 0, y: 8, w: 6, h: 8 },
    { i: 'type-stats', x: 0, y: 16, w: 6, h: 8 },
    { i: 'schedule', x: 0, y: 24, w: 6, h: 8 },
  ]
};

const WidgetWrapper = ({ children, title, onClose, isEditing, className, ...props }: any) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden h-full ${className}`} {...props}>
      <div className={cn(
        "p-3 bg-gray-50 border-b border-gray-100 flex justify-between items-center select-none z-10 group",
        isEditing ? "drag-handle cursor-move" : ""
      )}>
        <h3 className="font-semibold text-gray-700 text-sm flex items-center gap-2">
          {isEditing && <GripHorizontal className="w-4 h-4 text-gray-400" />}
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
            className="text-gray-400 hover:text-red-500 transition-colors"
            title="위젯 숨기기"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="flex-1 overflow-auto p-0 relative">
        {children}
      </div>
    </div>
  );
};

const DashboardContent = ({ 
  user,
  vacationStats,
  monthStats,
  vacationTypes,
  users,
}: any) => {
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

  // Speed Dial Actions Configuration
  const speedDialActions: SpeedDialAction[] = useMemo(() => {
    if (isEditing) {
      return [
        {
          icon: <Save className="w-5 h-5" />,
          label: '저장',
          onClick: handleSave,
          variant: 'default',
          className: 'bg-green-600 hover:bg-green-700'
        },
        {
          icon: <X className="w-5 h-5" />,
          label: '취소',
          onClick: handleCancel,
          variant: 'destructive'
        },
        {
          icon: <Settings className="w-5 h-5" />,
          label: isToolboxOpen ? '설정 닫기' : '위젯 설정',
          onClick: () => setIsToolboxOpen(!isToolboxOpen),
          variant: 'secondary'
        }
      ];
    }
    return [
      {
        icon: <Pencil className="w-5 h-5" />,
        label: '대시보드 편집',
        onClick: () => setTimeout(() => setIsEditing(true), 300),
        variant: 'default'
      }
    ];
  }, [isEditing, isToolboxOpen, handleSave, handleCancel]);

  return (
    <div className="min-h-screen bg-gray-50/50 relative overflow-hidden flex flex-col">
      {/* Top Bar - Removed buttons, kept title */}
      {/* <div className="bg-white border-b px-6 py-3 flex justify-between items-center sticky top-0 z-30 shadow-sm h-16">
        <h1 className="text-xl font-bold text-gray-800">대시보드</h1>
      </div> */} 
      {/* Removing header completely as per previous request to maximize space, 
          or we can keep a minimal header if needed. 
          Let's keep it minimal or remove it if user wants full screen.
          User said "remove dashboard text" before, but I added it back in previous step.
          I will remove it again to be consistent with "maximize space" and use SpeedDial.
      */}

      <div className="flex-1 overflow-y-auto p-4 pt-8">
        <ResponsiveGridLayout
          className="layout min-h-screen"
          layouts={layouts}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={30}
          draggableHandle=".drag-handle"
          onLayoutChange={handleLayoutChange}
          onBreakpointChange={handleBreakpointChange}
          margin={[16, 16]}
          isDroppable={isEditing}
          isDraggable={isEditing}
          isResizable={isEditing}
          onDrop={onDrop}
          droppingItem={draggedWidget ? { i: draggedWidget.id, w: draggedWidget.defaultW, h: draggedWidget.defaultH } : undefined}
        >
          {activeWidgets.includes('profile') && (
            <div key="profile">
              <WidgetWrapper title="내 정보" onClose={() => toggleWidget('profile')} isEditing={isEditing}>
                {user ? (
                  <div className="h-full overflow-y-auto">
                     <UserInfoCard value={[user]} />
                  </div>
                ) : <UserInfoCardSkeleton />}
              </WidgetWrapper>
            </div>
          )}

          {activeWidgets.includes('vacation-stats') && (
            <div key="vacation-stats">
              <WidgetWrapper title="휴가 현황" onClose={() => toggleWidget('vacation-stats')} isEditing={isEditing}>
                 {vacationStats ? <VacationStatsCard value={vacationStats} /> : <VacationStatsCardSkeleton />}
              </WidgetWrapper>
            </div>
          )}

          {activeWidgets.includes('month-stats') && (
            <div key="month-stats">
              <WidgetWrapper title="월별 휴가 통계" onClose={() => toggleWidget('month-stats')} isEditing={isEditing}>
                {monthStats ? <MonthVacationStatsCard value={monthStats} className="h-full" /> : <MonthVacationStatsCardSkeleton />}
              </WidgetWrapper>
            </div>
          )}

          {activeWidgets.includes('type-stats') && (
            <div key="type-stats">
              <WidgetWrapper title="휴가 유형별 통계" onClose={() => toggleWidget('type-stats')} isEditing={isEditing}>
                 {vacationTypes ? <VacationTypeStatsCard value={vacationTypes} className="h-full" /> : <VacationTypeStatsCardSkeleton />}
              </WidgetWrapper>
            </div>
          )}

          {activeWidgets.includes('schedule') && (
            <div key="schedule">
              <WidgetWrapper title="근무 일정" onClose={() => toggleWidget('schedule')} isEditing={isEditing}>
                 {users ? <ScheduleTable users={users} /> : <ScheduleSkeleton />}
              </WidgetWrapper>
            </div>
          )}
        </ResponsiveGridLayout>
      </div>

      {/* Speed Dial Button */}
      <SpeedDial 
        actions={speedDialActions}
        mainIcon={isEditing ? <Settings className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
        activeIcon={<X className="h-6 w-6" />}
      />

      {/* Custom Non-Modal Toolbox Panel */}
      <div 
        className={cn(
          "fixed top-0 right-0 bottom-0 w-80 bg-white shadow-2xl border-l transform transition-transform duration-300 ease-in-out z-40 overflow-y-auto",
          isEditing && isToolboxOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="p-6 pt-20">
          <h2 className="text-lg font-semibold mb-6">위젯 설정</h2>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground mb-4">사용 가능한 위젯</h4>
              <p className="text-xs text-gray-400 mb-4">
                위젯을 드래그하여 대시보드에 추가하세요.
              </p>
              
              {WIDGETS.map(widget => {
                const isActive = activeWidgets.includes(widget.id);
                return (
                  <div 
                    key={widget.id}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg border bg-card transition-colors select-none",
                      isActive ? "opacity-50 cursor-not-allowed bg-gray-50" : "hover:bg-accent/50 cursor-grab active:cursor-grabbing"
                    )}
                    draggable={!isActive}
                    onDragStart={(e) => {
                      if (isActive) {
                        e.preventDefault();
                        return;
                      }
                      setDraggedWidget(widget);
                      // Required for Firefox
                      e.dataTransfer.setData("text/plain", "");
                    }}
                    onDragEnd={() => {
                      setDraggedWidget(null);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <GripVertical className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-sm">{widget.label}</span>
                    </div>
                    {isActive && <span className="text-xs text-green-600 font-medium">사용 중</span>}
                  </div>
                );
              })}
            </div>

            <div className="pt-8 border-t mt-8">
              <Button 
                variant="destructive" 
                className="w-full" 
                onClick={resetLayout}
              >
                레이아웃 초기화
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardSkeleton = () => {
  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="col-span-1"><UserInfoCardSkeleton /></div>
      <div className="col-span-1"><VacationStatsCardSkeleton /></div>
      <div className="col-span-2"><MonthVacationStatsCardSkeleton /></div>
      <div className="col-span-1"><VacationTypeStatsCardSkeleton /></div>
      <div className="col-span-3"><ScheduleSkeleton /></div>
    </div>
  );
};

export default function Dashboard() {
  const { loginUser } = useUser();
  const user_id = loginUser?.user_id || '';

  const { data: user, isLoading: userLoading, error: userError } = useUserQuery(user_id);
  const { data: vacationTypes, isLoading: vacationTypesLoading, error: vacationTypesError } = useAvailableVacationsQuery(
    user_id,
    dayjs().format('YYYY-MM-DDTHH:mm:ss')
  );
  const { data: monthStats, isLoading: monthStatsLoading, error: monthStatsError } = useUserMonthlyVacationStatsQuery(
    user_id,
    dayjs().format('YYYY')
  );
  const { data: vacationStats, isLoading: vacationStatsLoading, error: vacationStatsError } = useUserVacationStatsQuery(
    user_id,
    dayjs().format('YYYY-MM-DDTHH:mm:ss')
  );
  const { data: users, isLoading: usersLoading, error: usersError } = useUsersQuery();

  const isLoading = userLoading || vacationTypesLoading || monthStatsLoading || vacationStatsLoading || usersLoading;
  const error = userError || vacationTypesError || monthStatsError || vacationStatsError || usersError;

  return (
    <QueryAsyncBoundary
      queryState={{ isLoading, error, data: user }}
      loadingComponent={<DashboardSkeleton />}
      errorComponent={
        <div className='p-4 sm:p-6 md:p-8'>
          <div className='p-8 text-center text-red-600'>
            데이터를 불러오는데 실패했습니다.
          </div>
        </div>
      }
    >
      <DashboardContent
        user={user}
        vacationStats={vacationStats}
        monthStats={monthStats}
        vacationTypes={vacationTypes}
        users={users}
      />
    </QueryAsyncBoundary>
  );
}