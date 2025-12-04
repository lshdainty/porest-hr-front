'use client';

import { format, parseISO } from 'date-fns';
import { Calendar, Clock, Text, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/shadcn/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/shadcn/dialog';
import { Spinner } from '@/components/shadcn/spinner';
import { EditEventDialog } from '@/features/home/calendar/components/dialogs/edit-event-dialog';
import { useDeleteEvent } from '@/features/home/calendar/hooks/use-delete-event';

import type { IEvent } from '@/features/home/calendar/interfaces';

interface IProps {
  event: IEvent;
  children: React.ReactNode;
}

export function EventDetailsDialog({ event, children }: IProps) {
  const { t } = useTranslation('calendar');
  const { t: tc } = useTranslation('common');
  const startDate = parseISO(event.startDate);
  const endDate = parseISO(event.endDate);

  const { deleteEvent, isPending } = useDeleteEvent();

  const handleDelete = () => {
    deleteEvent(event);
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>

        <DialogContent className='sm:max-w-sm'>
          <DialogHeader>
            <DialogTitle>{event.user.name} {event.title}</DialogTitle>
          </DialogHeader>

          <div className='space-y-4'>
            <div className='flex items-start gap-2'>
              <User className='mt-1 size-4 shrink-0' />
              <div>
                <p className='text-sm font-medium'>{t('eventDetails.user')}</p>
                <p className='text-sm text-muted-foreground'>{event.user.name}</p>
              </div>
            </div>

            <div className='flex items-start gap-2'>
              <Calendar className='mt-1 size-4 shrink-0' />
              <div>
                <p className='text-sm font-medium'>{t('eventDetails.startDate')}</p>
                <p className='text-sm text-muted-foreground'>{format(startDate, 'yyyy.MM.dd hh:mm a')}</p>
              </div>
            </div>

            <div className='flex items-start gap-2'>
              <Clock className='mt-1 size-4 shrink-0' />
              <div>
                <p className='text-sm font-medium'>{t('eventDetails.endDate')}</p>
                <p className='text-sm text-muted-foreground'>{format(endDate, 'yyyy.MM.dd hh:mm a')}</p>
              </div>
            </div>

            <div className='flex items-start gap-2'>
              <Text className='mt-1 size-4 shrink-0' />
              <div>
                <p className='text-sm font-medium'>{t('eventDetails.content')}</p>
                <p className='text-sm text-muted-foreground'>{event.description}</p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <EditEventDialog event={event}>
              <Button type='button' variant='outline'>
                {tc('edit')}
              </Button>
            </EditEventDialog>
            <Button type='button' variant='destructive' onClick={handleDelete} disabled={isPending}>
              {isPending && <Spinner />}
              {tc('delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
