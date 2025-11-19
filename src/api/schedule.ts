import { CalendarQueryKey } from '@/api/calendar';
import { api, type ApiResponse } from '@/api/index';
import { toast } from '@/components/alert/toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const enum ScheduleQueryKey {
  POST_SCHEDULE = 'postSchedule',
  PUT_UPDATE_SCHEDULE = 'putUpdateSchedule',
  DELETE_SCHEDULE = 'deleteSchedule'
}

interface PostScheduleReq {
  user_id: string
  start_date: string
  end_date: string
  schedule_type: string
  schedule_desc: string
}

interface PutUpdateScheduleReq {
  schedule_id: number
  user_id: string
  start_date: string
  end_date: string
  schedule_type: string
  schedule_desc: string
}

interface PutUpdateScheduleResp {
  schedule_id: number
}

const usePostSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (d: PostScheduleReq) => {
      const resp: ApiResponse = await api.request({
        method: 'post',
        url: `/schedule`,
        data: d
      });

      if (resp.code !== 200) throw new Error(resp.message);

      return resp.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CalendarQueryKey.GET_EVENTS_BY_PERIOD] });
      toast.success('일정이 등록되었습니다.');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
}

const usePutUpdateSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reqData: PutUpdateScheduleReq): Promise<PutUpdateScheduleResp> => {
      const { schedule_id, ...data } = reqData;
      const resp: ApiResponse<PutUpdateScheduleResp> = await api.request({
        method: 'put',
        url: `/schedule/${schedule_id}`,
        data: data
      });

      if (resp.code !== 200) throw new Error(resp.message);

      return resp.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CalendarQueryKey.GET_EVENTS_BY_PERIOD] });
      toast.success('일정이 수정되었습니다.');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
}

const useDeleteSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (scheduleId: Number) => {
      const resp: ApiResponse = await api.request({
        method: 'delete',
        url: `/schedule/${scheduleId}`,
      });

      if (resp.code !== 200) throw new Error(resp.message);

      return resp.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CalendarQueryKey.GET_EVENTS_BY_PERIOD] });
      toast.success('일정이 삭제되었습니다.');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
}

export {
  // QueryKey
  ScheduleQueryKey,

  // API Hook
  usePostSchedule,
  usePutUpdateSchedule,
  useDeleteSchedule
};
