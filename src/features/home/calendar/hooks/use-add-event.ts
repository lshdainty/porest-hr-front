import { usePostScheduleMutation } from '@/hooks/queries/useSchedules'
import { usePostUseVacationMutation } from '@/hooks/queries/useVacations'
import { calendarTypes } from '@/features/home/calendar/types'
import dayjs from 'dayjs'

export interface AddEventParams {
  userId: string
  calendarType: string
  vacationType?: string
  desc?: string
  startDate: string
  endDate: string
  startHour?: string
  startMinute?: string
}

interface UseAddEventOptions {
  onSuccess?: () => void
}

export const useAddEvent = () => {
  const { mutate: postUseVacation, isPending: isVacationPending } = usePostUseVacationMutation()
  const { mutate: postSchedule, isPending: isSchedulePending } = usePostScheduleMutation()

  const isPending = isVacationPending || isSchedulePending

  const addEvent = (params: AddEventParams, options?: UseAddEventOptions) => {
    const {
      userId,
      calendarType,
      vacationType,
      desc,
      startDate,
      endDate,
      startHour,
      startMinute
    } = params

    const selectedCalendar = calendarTypes.find(c => c.id === calendarType)
    const isVacation = selectedCalendar?.type === 'vacation'
    const isDate = selectedCalendar?.isDate

    const format = 'YYYY-MM-DDTHH:mm:ss'
    const payload: any = {
      user_id: userId,
    }

    // 날짜 계산 로직
    if (isDate) {
      // 종일 이벤트
      payload.start_date = dayjs(startDate).startOf('day').format(format)
      payload.end_date = dayjs(endDate).endOf('day').format(format)
    } else {
      // 시간 이벤트 - calendarType에 따라 종료 시간 계산
      let plusHour = 0
      switch(calendarType) {
        case 'MORNINGOFF':
        case 'AFTERNOONOFF':
        case 'HEALTHCHECKHALF':
        case 'DEFENSEHALF':
          plusHour = 4
          break
        case 'ONETIMEOFF':
          plusHour = 1
          break
        case 'TWOTIMEOFF':
          plusHour = 2
          break
        case 'THREETIMEOFF':
          plusHour = 3
          break
        case 'FIVETIMEOFF':
          plusHour = 5
          break
        case 'SIXTIMEOFF':
          plusHour = 6
          break
        case 'SEVENTIMEOFF':
          plusHour = 7
          break
        default:
          break
      }

      payload.start_date = dayjs(startDate)
        .hour(Number(startHour))
        .minute(Number(startMinute))
        .second(0)
        .format(format)
      payload.end_date = dayjs(endDate)
        .hour(Number(startHour) + plusHour)
        .minute(Number(startMinute))
        .second(0)
        .format(format)
    }

    // API 호출 - 휴가 vs 스케줄
    if (isVacation) {
      payload.vacation_type = vacationType
      payload.vacation_time_type = calendarType
      payload.vacation_desc = desc
      postUseVacation(payload, {
        onSuccess: options?.onSuccess
      })
    } else {
      payload.schedule_type = calendarType
      payload.schedule_desc = desc
      postSchedule(payload, {
        onSuccess: options?.onSuccess
      })
    }
  }

  return { addEvent, isPending }
}
