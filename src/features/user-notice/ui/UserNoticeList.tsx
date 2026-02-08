import { Badge } from '@/shared/ui/shadcn/badge'
import { NoticeListResp, NoticeType } from '@/entities/notice'
import { cn } from '@/shared/lib'
import dayjs from 'dayjs'
import { Calendar, Eye, Pin, User } from 'lucide-react'

interface UserNoticeListProps {
  notices: NoticeListResp[];
  onSelectNotice: (noticeId: number) => void;
}

const noticeTypeBadgeVariant: Record<NoticeType, 'default' | 'destructive' | 'secondary' | 'outline'> = {
  GENERAL: 'secondary',
  URGENT: 'destructive',
  EVENT: 'default',
  MAINTENANCE: 'outline',
};

export const UserNoticeList = ({ notices, onSelectNotice }: UserNoticeListProps) => {
  return (
    <div className="space-y-3">
      {notices.map((notice) => (
        <div
          key={notice.notice_id}
          className={cn(
            'p-4 border rounded-lg cursor-pointer transition-colors hover:bg-accent/50',
            notice.is_pinned === 'Y' && 'border-primary/50 bg-primary/5'
          )}
          onClick={() => onSelectNotice(notice.notice_id)}
        >
          <div className="flex items-start gap-3">
            {notice.is_pinned === 'Y' && (
              <Pin className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={noticeTypeBadgeVariant[notice.notice_type]} className="flex-shrink-0">
                  {notice.notice_type_name}
                </Badge>
                <h3 className="font-medium truncate">{notice.title}</h3>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>{notice.writer_name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{dayjs(notice.create_date).format('YYYY-MM-DD')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>{notice.view_count}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
