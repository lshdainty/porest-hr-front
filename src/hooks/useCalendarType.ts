export const useCalendarType = () => {
  return [
    {
      id: 'DAYOFF',
      name: '연차',
      colorCode: '#9e5fff',
      type: 'vacation',
      isDate: true
    },
    {
      id: 'MORNINGOFF',
      name: '오전반차',
      colorCode: '#00a9ff',
      type: 'vacation',
      isDate: false
    },
    {
      id: 'AFTERNOONOFF',
      name: '오후반차',
      colorCode: '#ff5583',
      type: 'vacation',
      isDate: false
    },
    {
      id: 'ONETIMEOFF',
      name: '1시간 휴가',
      colorCode: '#ffbb3b',
      type: 'vacation',
      isDate: false
    },
    {
      id: 'TWOTIMEOFF',
      name: '2시간 휴가',
      colorCode: '#ffbb3b',
      type: 'vacation',
      isDate: false
    },
    {
      id: 'THREETIMEOFF',
      name: '3시간 휴가',
      colorCode: '#ffbb3b',
      type: 'vacation',
      isDate: false
    },
    {
      id: 'FIVETIMEOFF',
      name: '5시간 휴가',
      colorCode: '#ffbb3b',
      type: 'vacation',
      isDate: false
    },
    {
      id: 'SIXTIMEOFF',
      name: '6시간 휴가',
      colorCode: '#ffbb3b',
      type: 'vacation',
      isDate: false
    },
    {
      id: 'SEVENTIMEOFF',
      name: '7시간 휴가',
      colorCode: '#ffbb3b',
      type: 'vacation',
      isDate: false
    },
    {
      id: 'HALFTIMEOFF',
      name: '30분 휴가',
      colorCode: '#ffbb3b',
      type: 'vacation',
      isDate: false
    },
    {
      id: 'BUSINESSTRIP',
      name: '출장',
      colorCode: '#03bd9e',
      type: 'schedule',
      isDate: true
    },
    {
      id: 'EDUCATION',
      name: '교육',
      colorCode: '#ff6450',
      type: 'schedule',
      isDate: true
    },
    {
      id: 'BIRTHDAY',
      name: '생일',
      colorCode: '#7bb65a',
      type: 'schedule',
      isDate: true
    },
    {
      id: 'BIRTHPARTY',
      name: '생일파티',
      colorCode: '#7bb65a',
      type: 'schedule',
      isDate: true
    },
    {
      id: 'HEALTHCHECKHALF',
      name: '건강검진(반차)',
      colorCode: '#707bf5',
      type: 'vacation',
      isDate: false
    },
    {
      id: 'DEFENSE',
      name: '민방위',
      colorCode: '#a06549',
      type: 'vacation',
      isDate: true
    },
    {
      id: 'DEFENSEHALF',
      name: '민방위(반차)',
      colorCode: '#a06549',
      type: 'vacation',
      isDate: false
    }
  ];
}

export const convertColorCode = (scheduleType: string) => {
  isDate: true
  let colorCode = '';

  switch(scheduleType) {
    case 'DAYOFF':
      colorCode = '#9e5fff';
      break
    case 'MORNINGOFF':
      colorCode = '#00a9ff';
      break
    case 'AFTERNOONOFF':
      colorCode = '#ff5583';
      break
    case 'ONETIMEOFF':
      colorCode = '#ffbb3b';
      break
    case 'TWOTIMEOFF':
      colorCode = '#ffbb3b';
      break
    case 'THREETIMEOFF':
      colorCode = '#ffbb3b';
      break
    case 'FIVETIMEOFF':
      colorCode = '#ffbb3b';
      break
    case 'SIXTIMEOFF':
      colorCode = '#ffbb3b';
      break
    case 'SEVENTIMEOFF':
      colorCode = '#ffbb3b';
      break
    case 'HALFTIMEOFF':
      colorCode = '#ffbb3b';
      break
    case 'EDUCATION':
      colorCode = '#ff6450';
      break
    case 'BIRTHDAY':
      colorCode = '#7bb65a';
      break
    case 'BUSINESSTRIP':
      colorCode = '#03bd9e';
      break
    case 'DEFENSE':
      colorCode = '#a06549';
      break
    case 'DEFENSEHALF':
      colorCode = '#a06549';
      break
    case 'HEALTHCHECKHALF':
      colorCode = '#707bf5';
      break
    case 'BIRTHPARTY':
      colorCode = '#7bb65a';
      break
    default:
  }

  return colorCode;
}