import { SpeedDial, SpeedDialAction } from '@/components/common/SpeedDial';
import { Button } from '@/components/shadcn/button';
import ApplicationTableWidget from '@/features/home/dashboard/components/widgets/ApplicationTableWidget';
import DuesWidget from '@/features/home/dashboard/components/widgets/DuesWidget';
import MissingWorkHistoryWidget from '@/features/home/dashboard/components/widgets/MissingWorkHistoryWidget';
import MonthStatsWidget from '@/features/home/dashboard/components/widgets/MonthStatsWidget';
import ProfileWidget from '@/features/home/dashboard/components/widgets/ProfileWidget';
import ScheduleWidget from '@/features/home/dashboard/components/widgets/ScheduleWidget';
import SystemCheckWidget from '@/features/home/dashboard/components/widgets/SystemCheckWidget';
import TodayWorkStatusWidget from '@/features/home/dashboard/components/widgets/TodayWorkStatusWidget';
import TotalDuesWidget from '@/features/home/dashboard/components/widgets/TotalDuesWidget';
import TypeStatsWidget from '@/features/home/dashboard/components/widgets/TypeStatsWidget';
import UserBirthDuesWidget from '@/features/home/dashboard/components/widgets/UserBirthDuesWidget';
import UserCompanyStatsWidget from '@/features/home/dashboard/components/widgets/UserCompanyStatsWidget';
import UserVacationStatsWidget from '@/features/home/dashboard/components/widgets/UserVacationStatsWidget';
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
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation('dashboard')
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
          label: t('save'),
          onClick: handleSave,
          variant: 'default',
          className: 'bg-green-600 hover:bg-green-700'
        },
        {
          icon: <X className='w-5 h-5' />,
          label: t('closeSettings'),
          onClick: handleCancel,
          variant: 'destructive'
        },
        {
          icon: <Settings className='w-5 h-5' />,
          label: isToolboxOpen ? t('closeSettings') : t('widgetSettings'),
          onClick: () => setIsToolboxOpen(!isToolboxOpen),
          variant: 'secondary'
        }
      ];
    }
    return [
      {
        icon: <Pencil className='w-5 h-5' />,
        label: t('edit'),
        onClick: () => setTimeout(() => setIsEditing(true), 300),
        variant: 'default'
      }
    ];
  }, [isEditing, isToolboxOpen, handleSave, handleCancel, setIsEditing, setIsToolboxOpen, t]);

  const widgetConfig: Record<string, { title: string; component: React.ReactNode }> = {
    profile: {
      title: t('widget.myInfo'),
      component: <ProfileWidget user={user} />
    },
    'vacation-stats': {
      title: t('widget.vacationStatus'),
      component: <VacationStatsWidget vacationStats={vacationStats} />
    },
    'month-stats': {
      title: t('widget.monthlyVacationStats'),
      component: <MonthStatsWidget monthStats={monthStats} />
    },
    'type-stats': {
      title: t('widget.vacationTypeStats'),
      component: <TypeStatsWidget vacationTypes={vacationTypes} />
    },
    schedule: {
      title: t('widget.workSchedule'),
      component: <ScheduleWidget users={users} />
    },
    'vacation-application': {
      title: t('widget.vacationApplicationHistory'),
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
      title: t('widget.vacationApplicationStats'),
      component: <VacationRequestStatsWidget stats={requestStats} />
    },
    'vacation-history': {
      title: t('widget.vacationHistory'),
      component: <VacationHistoryWidget vacationHistory={vacationHistory} />
    },
    'dues': {
      title: t('widget.duesHistory'),
      component: <DuesWidget yearDues={yearDues} />
    },
    'total-dues': {
      title: t('widget.duesStatus'),
      component: <TotalDuesWidget totalDues={totalDues} birthDues={birthDues} />
    },
    'user-birth-dues': {
      title: t('widget.monthlyBirthdayDeposit'),
      component: <UserBirthDuesWidget usersBirthDues={usersBirthDues} users={users} />
    },
    'user-company-stats': {
      title: t('widget.companyUserStats'),
      component: <UserCompanyStatsWidget users={users} />
    },
    'system-check': {
      title: t('widget.systemDailyCheck'),
      component: <SystemCheckWidget />
    },
    'today-work-status': {
      title: t('widget.workHistoryStatus'),
      component: <TodayWorkStatusWidget />
    },
    'missing-work-history': {
      title: t('widget.monthlyWorkAlert'),
      component: <MissingWorkHistoryWidget />
    },
    'user-vacation-stats': {
      title: t('widget.allUserVacationStatus'),
      component: <UserVacationStatsWidget />
    }
  };

  const cols = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 };

  const constrainedLayouts = useMemo(() => {
    const newLayouts: any = {};
    Object.keys(layouts).forEach(breakpoint => {
      newLayouts[breakpoint] = layouts[breakpoint].map((item: any) => {
        const widgetDef = WIDGETS.find(w => w.id === item.i);
        if (widgetDef) {
          const breakpointCols = cols[breakpoint as keyof typeof cols] || 12;
          return {
            ...item,
            minW: Math.min(widgetDef.minW, breakpointCols),
            maxW: widgetDef.maxW,
            minH: widgetDef.minH,
            maxH: widgetDef.maxH
          };
        }
        return item;
      });
    });
    return newLayouts;
  }, [layouts]);

  return (
    <div className='min-h-screen bg-background relative overflow-hidden flex flex-col'>
      <div className='flex-1 overflow-y-auto'>
        <ResponsiveGridLayout
          className='layout min-h-screen'
          layouts={constrainedLayouts}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={cols}
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
          <h2 className='text-lg font-semibold mb-6'>{t('widgetSettings')}</h2>

          <div className='space-y-4'>
            <div className='space-y-2'>
              <h4 className='text-sm font-medium text-muted-foreground mb-4'>{t('availableWidgets')}</h4>
              <p className='text-xs text-muted-foreground mb-4'>
                {t('widgetDragHint')}
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
                      <span className='font-medium text-sm'>{t(widget.labelKey)}</span>
                    </div>
                    {isActive && <span className='text-xs text-green-600 font-medium'>{t('inUse')}</span>}
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
                {t('layoutReset')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
