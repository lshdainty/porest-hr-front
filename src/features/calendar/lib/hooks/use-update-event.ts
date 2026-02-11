import type { IEvent } from '@/features/calendar/model/interfaces';
import { calendarTypes } from '@/features/calendar/model/types';
import { usePutUpdateScheduleMutation } from '@/entities/schedule';
import { usePutUpdateVacationUsageMutation } from '@/entities/vacation';
import dayjs from 'dayjs';

export interface UpdateEventParams {
  eventId: number;
  userId: string;
  calendarType: string;
  vacationType?: string;
  desc?: string;
  startDate: string;
  endDate: string;
  startHour?: string;
  startMinute?: string;
  userWorkTime?: string;
}

// 오후반 여부 확인 (13시 출근자)
const isAfternoonShift = (workTime?: string): boolean => {
  return workTime === '13 ~ 21';
};

// 휴식시간 포함하여 종료시간 계산
const calculateEndHourWithBreak = (
  startHour: number,
  plusHour: number,
  workTime?: string
): number => {
  const endHour = startHour + plusHour;

  if (isAfternoonShift(workTime)) {
    // 오후반: 저녁시간(18~19) 고려
    // 시작시간이 18시 이전이고 종료시간이 18시를 넘는 경우만 +1
    if (startHour < 18 && endHour > 18) {
      return endHour + 1;
    }
  } else {
    // 오전반: 점심시간(12~13) 고려
    // 시작시간이 12시 이전이고 종료시간이 12시를 넘는 경우만 +1
    if (startHour < 12 && endHour > 12) {
      return endHour + 1;
    }
  }

  return endHour;
};

interface UseUpdateEventOptions {
  onSuccess?: () => void;
}

export const useUpdateEvent = () => {
  const { mutate: updateVacation, isPending: isVacationPending } = usePutUpdateVacationUsageMutation();
  const { mutate: updateSchedule, isPending: isSchedulePending } = usePutUpdateScheduleMutation();

  const isPending = isVacationPending || isSchedulePending;

  // Drag & Drop에서 사용하는 IEvent 기반 업데이트 (날짜만 변경)
  function updateEvent(event: IEvent, options?: UseUpdateEventOptions): void;
  // Form에서 사용하는 UpdateEventParams 기반 업데이트 (모든 필드 변경 가능)
  function updateEvent(params: UpdateEventParams, options?: UseUpdateEventOptions): void;

  function updateEvent(
    eventOrParams: IEvent | UpdateEventParams,
    options?: UseUpdateEventOptions
  ): void {
    // IEvent 타입인지 확인 (drag & drop용)
    if ('user' in eventOrParams && 'type' in eventOrParams) {
      const event = eventOrParams as IEvent;
      const format = 'YYYY-MM-DDTHH:mm:ss';

      const isVacation = event.type.type === 'vacation';
      const payload: any = {
        user_id: event.user.id,
        start_date: dayjs(event.startDate).format(format),
        end_date: dayjs(event.endDate).format(format),
      };

      if (isVacation) {
        payload.vacation_usage_id = event.id;
        payload.vacation_type = event.vacationType || '';
        payload.vacation_time_type = event.type.id;
        payload.vacation_desc = event.description;
        updateVacation(payload, {
          onSuccess: options?.onSuccess
        });
      } else {
        payload.schedule_id = event.id;
        payload.schedule_type = event.type.id;
        payload.schedule_desc = event.description;
        updateSchedule(payload, {
          onSuccess: options?.onSuccess
        });
      }
      return;
    }

    // UpdateEventParams 타입 (form용)
    const params = eventOrParams as UpdateEventParams;
    const {
      eventId,
      userId,
      calendarType,
      vacationType,
      desc,
      startDate,
      endDate,
      startHour,
      startMinute,
      userWorkTime
    } = params;

    const selectedCalendar = calendarTypes.find(c => c.id === calendarType);
    const isVacation = selectedCalendar?.type === 'vacation';
    const isDate = selectedCalendar?.isDate;

    const format = 'YYYY-MM-DDTHH:mm:ss';
    const payload: any = {
      user_id: userId,
    };

    // 날짜 계산 로직 (add-event와 동일)
    if (isDate) {
      // 종일 이벤트
      payload.start_date = dayjs(startDate).startOf('day').format(format);
      payload.end_date = dayjs(endDate).endOf('day').format(format);
    } else {
      // 시간 이벤트 - calendarType에 따라 종료 시간 계산
      let plusHour = 0;
      switch(calendarType) {
        case 'MORNINGOFF':
        case 'AFTERNOONOFF':
        case 'HEALTHCHECKHALF':
        case 'DEFENSEHALF':
          plusHour = 4;
          break;
        case 'ONETIMEOFF':
          plusHour = 1;
          break;
        case 'TWOTIMEOFF':
          plusHour = 2;
          break;
        case 'THREETIMEOFF':
          plusHour = 3;
          break;
        case 'FIVETIMEOFF':
          plusHour = 5;
          break;
        case 'SIXTIMEOFF':
          plusHour = 6;
          break;
        case 'SEVENTIMEOFF':
          plusHour = 7;
          break;
        default:
          break;
      }

      const endHour = calculateEndHourWithBreak(Number(startHour), plusHour, userWorkTime);

      payload.start_date = dayjs(startDate)
        .hour(Number(startHour))
        .minute(Number(startMinute))
        .second(0)
        .format(format);
      payload.end_date = dayjs(endDate)
        .hour(endHour)
        .minute(Number(startMinute))
        .second(0)
        .format(format);
    }

    // API 호출 - 휴가 vs 스케줄
    if (isVacation) {
      payload.vacation_usage_id = eventId;
      payload.vacation_type = vacationType;
      payload.vacation_time_type = calendarType;
      payload.vacation_desc = desc;
      updateVacation(payload, {
        onSuccess: options?.onSuccess
      });
    } else {
      payload.schedule_id = eventId;
      payload.schedule_type = calendarType;
      payload.schedule_desc = desc;
      updateSchedule(payload, {
        onSuccess: options?.onSuccess
      });
    }
  }

  return { updateEvent, isPending };
}
