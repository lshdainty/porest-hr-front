import { SpeedDial, SpeedDialAction } from '@/components/common/SpeedDial';
import ScheduleSkeleton from '@/components/schedule/ScheduleSkeleton';
import ScheduleTable from '@/components/schedule/ScheduleTable';
import { Button } from '@/components/shadcn/button';
import UserInfoCard from '@/components/user/UserInfoCard';
import UserInfoCardSkeleton from '@/components/user/UserInfoCardSkeleton';
import MonthVacationStatsCard from '@/features/vacation/history/components/MonthVacationStatsCard';
import MonthVacationStatsCardSkeleton from '@/features/vacation/history/components/MonthVacationStatsCardSkeleton';
import VacationStatsCard from '@/features/vacation/history/components/VacationStatsCard';
import VacationStatsCardSkeleton from '@/features/vacation/history/components/VacationStatsCardSkeleton';
import VacationTypeStatsCard from '@/features/vacation/history/components/VacationTypeStatsCard';
import VacationTypeStatsCardSkeleton from '@/features/vacation/history/components/VacationTypeStatsCardSkeleton';
import { cn } from '@/lib/utils';
import { GripVertical, Pencil, Plus, Save, Settings, X } from 'lucide-react';
import { useMemo } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { WIDGETS } from '../constants';
import { useDashboardContext } from '../contexts/DashboardContext';
import WidgetWrapper from './WidgetWrapper';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface DashboardContentProps {
  user: any;
  vacationStats: any;
  monthStats: any;
  vacationTypes: any;
  users: any;
}

const DashboardContent = ({ 
  user,
  vacationStats,
  monthStats,
  vacationTypes,
  users,
}: DashboardContentProps) => {
  const {
    layouts,
    activeWidgets,
    isEditing,
    isToolboxOpen,
    draggedWidget,
    handleLayoutChange,
    handleBreakpointChange,
    toggleWidget,
    resetLayout,
    onDrop,
    handleSave,
    handleCancel,
    setIsEditing,
    setIsToolboxOpen,
    setDraggedWidget
  } = useDashboardContext();

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
  }, [isEditing, isToolboxOpen, handleSave, handleCancel, setIsEditing, setIsToolboxOpen]);

  return (
    <div className="min-h-screen bg-gray-50/50 relative overflow-hidden flex flex-col">
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

export default DashboardContent;
