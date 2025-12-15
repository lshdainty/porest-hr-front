// Widget 타입 정의
export interface Widget {
  id: string;
  labelKey: string;
  defaultH: number;
  defaultW: number;
  minW: number;
  maxW: number;
  minH: number;
  maxH: number;
  permissions?: string[]; // 권한이 없으면 모든 사용자에게 표시
}

// labelKey는 dashboard 네임스페이스의 번역 키
// permissions: 해당 권한 중 하나라도 있으면 위젯 표시 (없으면 모든 사용자에게 표시)
export const WIDGETS: Widget[] = [
  { id: 'profile', labelKey: 'widget.myInfo', defaultH: 14, defaultW: 3, minW: 3, maxW: 6, minH: 10, maxH: 13, permissions: ['USER:READ'] },
  { id: 'vacation-stats', labelKey: 'widget.vacationStatus', defaultH: 4, defaultW: 6, minW: 4, maxW: 12, minH: 4, maxH: 4, permissions: ['VACATION:READ'] },
  { id: 'month-stats', labelKey: 'widget.monthlyVacationStats', defaultH: 9, defaultW: 6, minW: 4, maxW: 12, minH: 6, maxH: 9, permissions: ['VACATION:READ'] },
  { id: 'type-stats', labelKey: 'widget.vacationTypeStats', defaultH: 14, defaultW: 3, minW: 3, maxW: 8, minH: 10, maxH: 20, permissions: ['VACATION:READ'] },
  { id: 'schedule', labelKey: 'widget.workSchedule', defaultH: 9, defaultW: 7, minW: 7, maxW: 12, minH: 6, maxH: 16, permissions: ['USER:READ'] },
  { id: 'vacation-application', labelKey: 'widget.vacationApplicationHistory', defaultH: 8, defaultW: 12, minW: 6, maxW: 12, minH: 6, maxH: 20, permissions: ['VACATION:REQUEST'] },
  { id: 'vacation-request-stats', labelKey: 'widget.vacationApplicationStats', defaultH: 6, defaultW: 12, minW: 6, maxW: 12, minH: 6, maxH: 12, permissions: ['VACATION:APPROVE'] },
  { id: 'vacation-history', labelKey: 'widget.vacationHistory', defaultH: 11, defaultW: 6, minW: 4, maxW: 12, minH: 8, maxH: 20, permissions: ['VACATION:READ'] },
  { id: 'dues', labelKey: 'widget.duesHistory', defaultH: 11, defaultW: 6, minW: 4, maxW: 12, minH: 8, maxH: 20, permissions: ['DUES:READ'] },
  { id: 'total-dues', labelKey: 'widget.duesStatus', defaultH: 5, defaultW: 6, minW: 5, maxW: 12, minH: 5, maxH: 10, permissions: ['DUES:READ'] },
  { id: 'user-birth-dues', labelKey: 'widget.monthlyBirthdayDeposit', defaultH: 9, defaultW: 7, minW: 7, maxW: 12, minH: 6, maxH: 16, permissions: ['DUES:READ'] },
  { id: 'user-company-stats', labelKey: 'widget.companyUserStats', defaultH: 5, defaultW: 6, minW: 5, maxW: 12, minH: 5, maxH: 12, permissions: ['COMPANY:MANAGE'] },
  { id: 'system-check', labelKey: 'widget.systemDailyCheck', defaultH: 8, defaultW: 6, minW: 3, maxW: 12, minH: 6, maxH: 16 },
  { id: 'today-work-status', labelKey: 'widget.workHistoryStatus', defaultH: 6, defaultW: 3, minW: 3, maxW: 12, minH: 6, maxH: 8, permissions: ['WORK:READ'] },
  { id: 'missing-work-history', labelKey: 'widget.monthlyWorkAlert', defaultH: 8, defaultW: 2, minW: 2, maxW: 2, minH: 8, maxH: 8, permissions: ['WORK:READ'] },
  { id: 'user-vacation-stats', labelKey: 'widget.allUserVacationStatus', defaultH: 8, defaultW: 6, minW: 4, maxW: 12, minH: 6, maxH: 12, permissions: ['VACATION:MANAGE'] },
  { id: 'department-chart', labelKey: 'widget.departmentChart', defaultH: 12, defaultW: 8, minW: 6, maxW: 12, minH: 10, maxH: 20, permissions: ['COMPANY:READ'] },
]

export const defaultLayouts = {
  lg: [
    { i: 'profile', x: 0, y: 0, w: 3, h: 13 },
    { i: 'vacation-stats', x: 3, y: 0, w: 6, h: 4 },
    { i: 'month-stats', x: 3, y: 4, w: 6, h: 9 },
    { i: 'type-stats', x: 9, y: 0, w: 3, h: 13 },
    { i: 'today-work-status', x: 0, y: 13, w: 3, h: 6 },
    { i: 'system-check', x: 3, y: 13, w: 9, h: 6 },
  ],
  md: [
    { i: 'profile', x: 0, y: 0, w: 3, h: 13 },
    { i: 'type-stats', x: 3, y: 0, w: 3, h: 13 },
    { i: 'vacation-stats', x: 0, y: 13, w: 6, h: 4 },
    { i: 'month-stats', x: 0, y: 17, w: 6, h: 9 },
    { i: 'today-work-status', x: 0, y: 26, w: 6, h: 6 },
    { i: 'system-check', x: 0, y: 32, w: 6, h: 8 },
  ],
  sm: [
    { i: 'profile', x: 0, y: 0, w: 2, h: 13 },
    { i: 'today-work-status', x: 0, y: 13, w: 2, h: 6 },
    { i: 'vacation-stats', x: 0, y: 19, w: 2, h: 4 },
    { i: 'month-stats', x: 0, y: 23, w: 2, h: 9 },
    { i: 'type-stats', x: 0, y: 32, w: 2, h: 13 },
    { i: 'system-check', x: 0, y: 45, w: 2, h: 8 },
  ],
}
