import { WorkCodeResp } from '@/lib/api/work';

export interface WorkHistory {
  no: number;
  work_history_seq?: number;
  date: string;
  manager_id: string;
  manager_name: string;
  work_group?: WorkCodeResp;
  work_part?: WorkCodeResp;
  work_division?: WorkCodeResp;
  hours: number | string;
  content: string;
}
