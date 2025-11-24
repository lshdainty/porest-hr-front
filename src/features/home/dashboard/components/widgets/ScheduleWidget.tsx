import ScheduleSkeleton from '@/features/work/schedule/components/ScheduleSkeleton';
import ScheduleTable from '@/features/work/schedule/components/ScheduleTable';
import { GetUsersResp } from '@/lib/api/user';

interface ScheduleWidgetProps {
  users?: GetUsersResp[];
}

const ScheduleWidget = ({ users }: ScheduleWidgetProps) => {
  if (!users) {
    return <ScheduleSkeleton />;
  }

  return <ScheduleTable users={users} />;
};

export default ScheduleWidget;
