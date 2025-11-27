import { SpeedDial, SpeedDialAction } from '@/components/common/SpeedDial';
import { Button } from '@/components/shadcn/button';
import ApplicationTableWidget from '@/features/home/dashboard/components/widgets/ApplicationTableWidget';
import DuesWidget from '@/features/home/dashboard/components/widgets/DuesWidget';
import MonthStatsWidget from '@/features/home/dashboard/components/widgets/MonthStatsWidget';
import ProfileWidget from '@/features/home/dashboard/components/widgets/ProfileWidget';
import ScheduleWidget from '@/features/home/dashboard/components/widgets/ScheduleWidget';
import SystemCheckWidget from '@/features/home/dashboard/components/widgets/SystemCheckWidget';
import TotalDuesWidget from '@/features/home/dashboard/components/widgets/TotalDuesWidget';
import TypeStatsWidget from '@/features/home/dashboard/components/widgets/TypeStatsWidget';
import UserBirthDuesWidget from '@/features/home/dashboard/components/widgets/UserBirthDuesWidget';
import UserCompanyStatsWidget from '@/features/home/dashboard/components/widgets/UserCompanyStatsWidget';
import VacationHistoryWidget from '@/features/home/dashboard/components/widgets/VacationHistoryWidget';
import VacationRequestStatsWidget from '@/features/home/dashboard/components/widgets/VacationRequestStatsWidget';
import VacationStatsWidget from '@/features/home/dashboard/components/widgets/VacationStatsWidget';
import WidgetWrapper from '@/features/home/dashboard/components/WidgetWrapper';
import { WIDGETS } from '@/features/home/dashboard/constants';
import { useDashboardContext } from '@/features/home/dashboard/contexts/DashboardContext';
import { TypeResp } from '@/lib/api/type';
import { GetUserRequestedVacationsResp, GetUserRequestedVacationStatsResp, GetUserVacationHistoryResp } from '@/lib/api/vacation';
import { cn } from '@/lib/utils';
import { GripVertical, Pencil, Plus, Save, Settings, X } from 'lucide-react';
import { useMemo } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface DashboardContentProps {
  user: any;
  vacationStats: any;
  monthStats: any;
  vacationTypes: any;
  users: any;
  vacationRequests?: GetUserRequestedVacationsResp[];
  requestStats?: GetUserRequestedVacationStatsResp;
  grantStatusTypes?: TypeResp[];
  vacationHistory?: GetUserVacationHistoryResp;
  yearDues?: any[];
  totalDues?: any;
  birthDues?: any;
  usersBirthDues?: any[];
}

const DashboardContent = ({ 
  user,
  vacationStats,
  monthStats,
  vacationTypes,
  users,
  vacationRequests,
  requestStats,
  grantStatusTypes = [],
  vacationHistory,
  yearDues,
  totalDues,
  birthDues,
  usersBirthDues
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
          icon: <Save className='w-5 h-5' />,
          label: '저장',
          onClick: handleSave,
          variant: 'default',
          className: 'bg-green-600 hover:bg-green-700'
        },
        {
          icon: <X className='w-5 h-5' />,
          label: '취소',
          onClick: handleCancel,
          variant: 'destructive'
        },
        {
          icon: <Settings className='w-5 h-5' />,
          label: isToolboxOpen ? '설정 닫기' : '위젯 설정',
          onClick: () => setIsToolboxOpen(!isToolboxOpen),
          variant: 'secondary'
        }
      ];
    }
    return [
      {
        icon: <Pencil className='w-5 h-5' />,
        label: '대시보드 편집',
        onClick: () => setTimeout(() => setIsEditing(true), 300),
        variant: 'default'
      }
    ];
  }, [isEditing, isToolboxOpen, handleSave, handleCancel, setIsEditing, setIsToolboxOpen]);

  const widgetConfig: Record<string, { title: string; component: React.ReactNode }> = {
    profile: {
      title: '내 정보',
      component: <ProfileWidget user={user} />
    },
    'vacation-stats': {
      title: '휴가 현황',
      component: <VacationStatsWidget vacationStats={vacationStats} />
    },
    'month-stats': {
      title: '월별 휴가 통계',
      component: <MonthStatsWidget monthStats={monthStats} />
    },
    'type-stats': {
      title: '휴가 유형별 통계',
      component: <TypeStatsWidget vacationTypes={vacationTypes} />
    },
    schedule: {
      title: '근무 일정',
      component: <ScheduleWidget users={users} />
    },
    'vacation-application': {
      title: '휴가 신청 내역',
      component: (
        <ApplicationTableWidget 
          vacationRequests={vacationRequests}
          grantStatusTypes={grantStatusTypes || []}
          userId={user?.user_id || ''}
          userName={user?.user_name}
        />
      )
    },
    'vacation-request-stats': {
      title: '휴가 신청 통계',
      component: <VacationRequestStatsWidget stats={requestStats} />
    },
    'vacation-history': {
      title: '휴가 내역',
      component: <VacationHistoryWidget vacationHistory={vacationHistory} />
    },
    'dues': {
      title: '회비 내역',
      component: <DuesWidget yearDues={yearDues} />
    },
    'total-dues': {
      title: '회비 현황',
      component: <TotalDuesWidget totalDues={totalDues} birthDues={birthDues} />
    },
    'user-birth-dues': {
      title: '월별 생일비 입금 현황',
      component: <UserBirthDuesWidget usersBirthDues={usersBirthDues} users={users} />
    },
    'user-company-stats': {
      title: '회사별 인원 현황',
      component: <UserCompanyStatsWidget users={users} />
    },
    'system-check': {
      title: '시스템 상태',
      component: <SystemCheckWidget />
    }
  };

  return (
    <div className='min-h-screen bg-background relative overflow-hidden flex flex-col'>
      <div className='flex-1 overflow-y-auto'>
        <ResponsiveGridLayout
          className='layout min-h-screen'
          layouts={layouts}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={30}
          draggableHandle='.drag-handle'
          onLayoutChange={handleLayoutChange}
          onBreakpointChange={handleBreakpointChange}
          margin={[16, 16]}
          isDroppable={isEditing}
          isDraggable={isEditing}
          isResizable={isEditing}
          onDrop={onDrop}
          droppingItem={draggedWidget ? { i: draggedWidget.id, w: draggedWidget.defaultW, h: draggedWidget.defaultH } : undefined}
        >
          {activeWidgets.map((widgetId) => {
            const config = widgetConfig[widgetId];
            if (!config) return null;

            return (
              <div key={widgetId}>
                <WidgetWrapper 
                  title={config.title} 
                  onClose={() => toggleWidget(widgetId)} 
                  isEditing={isEditing}
                >
                  {config.component}
                </WidgetWrapper>
              </div>
            );
          })}
        </ResponsiveGridLayout>
      </div>

      {/* Speed Dial Button */}
      <SpeedDial 
        actions={speedDialActions}
        mainIcon={isEditing ? <Settings className='h-6 w-6' /> : <Plus className='h-6 w-6' />}
        activeIcon={<X className='h-6 w-6' />}
      />

      {/* Custom Non-Modal Toolbox Panel */}
      <div 
        className={cn(
          'fixed top-0 right-0 bottom-0 w-80 bg-background shadow-2xl border-l transform transition-transform duration-300 ease-in-out z-40 overflow-y-auto',
          isEditing && isToolboxOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className='p-6 pt-20'>
          <h2 className='text-lg font-semibold mb-6'>위젯 설정</h2>
          
          <div className='space-y-4'>
            <div className='space-y-2'>
              <h4 className='text-sm font-medium text-muted-foreground mb-4'>사용 가능한 위젯</h4>
              <p className='text-xs text-muted-foreground mb-4'>
                위젯을 드래그하여 대시보드에 추가하세요.
              </p>
              
              {WIDGETS.map(widget => {
                const isActive = activeWidgets.includes(widget.id);
                return (
                  <div 
                    key={widget.id}
                    className={cn(
                      'flex items-center justify-between p-3 rounded-lg border bg-card transition-colors select-none',
                      isActive ? 'opacity-50 cursor-not-allowed bg-muted' : 'hover:bg-accent/50 cursor-grab active:cursor-grabbing'
                    )}
                    draggable={!isActive}
                    onDragStart={(e) => {
                      if (isActive) {
                        e.preventDefault();
                        return;
                      }
                      setDraggedWidget(widget);
                      // Required for Firefox
                      e.dataTransfer.setData('text/plain', '');
                    }}
                    onDragEnd={() => {
                      setDraggedWidget(null);
                    }}
                  >
                    <div className='flex items-center gap-3'>
                      <GripVertical className='w-4 h-4 text-muted-foreground' />
                      <span className='font-medium text-sm'>{widget.label}</span>
                    </div>
                    {isActive && <span className='text-xs text-green-600 font-medium'>사용 중</span>}
                  </div>
                );
              })}
            </div>

            <div className='pt-8 border-t mt-8'>
              <Button 
                variant='destructive' 
                className='w-full' 
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
