import { api, type ApiResponse } from '@/api/index';
import { convertApiEvents, type ApiEventResponse, type ApiUserResponse } from '@/components/big-calendar/calendar/helpers';

import type { IEvent, IUser } from '@/components/big-calendar/calendar/interfaces';

interface GetEventsParams {
  start_date: string;
  end_date: string;
}

export const getEvents = async (params: GetEventsParams): Promise<IEvent[]> => {
  try {
    const [eventsResp, usersResp] = await Promise.all([
      api.request<ApiResponse<ApiEventResponse[]>>({
        method: 'get',
        url: `/calendar/period?startDate=${params.start_date}&endDate=${params.end_date}`
      }),
      api.request<ApiResponse<ApiUserResponse[]>>({
        method: 'get',
        url: `/users`
      })
    ]);

    if (eventsResp.code !== 200) throw new Error(eventsResp.message);
    if (usersResp.code !== 200) throw new Error(usersResp.message);

    const { events } = convertApiEvents(eventsResp.data, usersResp.data);
    return events;
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
};

export const getUsers = async (): Promise<IUser[]> => {
  try {
    const resp: ApiResponse<ApiUserResponse[]> = await api.request({
      method: 'get',
      url: `/users`
    });

    if (resp.code !== 200) throw new Error(resp.message);

    return resp.data.map(user => ({
      id: user.user_id,
      name: user.user_name,
      picturePath: user.profile_url || null,
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};
