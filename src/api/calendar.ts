import { api, type ApiResponse } from '@/api/index';
import { useQuery } from '@tanstack/react-query';

const enum CalendarQueryKey {
  GET_EVENTS_BY_PERIOD = 'getEventsByPeriod'
}

interface getEventsByPeriodReq {
  start_date: string
  end_date: string
}

export interface getEventsByPeriodResp {
  user_id: string
  user_name: string
  calendar_name: string
  calendar_type: string
  calendar_desc: string
  start_date: Date
  end_date: Date
  domain_type: string
  vacation_type: string
  calendar_id: number
}

const useGetEventsByPeriod = (d: getEventsByPeriodReq) => {
  return useQuery({
    queryKey: [CalendarQueryKey.GET_EVENTS_BY_PERIOD, d.start_date, d.end_date],
    queryFn: async (): Promise<getEventsByPeriodResp[]> => {
      const resp: ApiResponse<getEventsByPeriodResp[]> = await api.request({
        method: 'get',
        url: `/calendar/period?startDate=${d.start_date}&endDate=${d.end_date}`
      });

      if (resp.code !== 200) throw new Error(resp.message);

      return resp.data;
    }
  });
}

export {
  // QueryKey
  CalendarQueryKey,

  // API Hook
  useGetEventsByPeriod
};
