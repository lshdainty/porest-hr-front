export const LAYOUT_STORAGE_KEY = 'porest-dashboard-layouts';
export const WIDGETS_STORAGE_KEY = 'porest-dashboard-widgets';

export const WIDGETS = [
  { id: 'profile', label: '내 정보', defaultH: 14, defaultW: 3 },
  { id: 'vacation-stats', label: '휴가 현황', defaultH: 4, defaultW: 3 },
  { id: 'month-stats', label: '월별 휴가 통계', defaultH: 8, defaultW: 6 },
  { id: 'type-stats', label: '휴가 유형별 통계', defaultH: 8, defaultW: 3 },
  { id: 'schedule', label: '근무 일정', defaultH: 8, defaultW: 9 },
  { id: 'vacation-application', label: '휴가 신청 내역', defaultH: 8, defaultW: 12 },
];

export const defaultLayouts = {
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
