import { Check, Filter as FilterIcon } from 'lucide-react';
import { useCalendar } from '@/components/big-calendar/calendar/contexts/calendar-context';
import { calendarTypes } from '@/components/big-calendar/calendar/types';

import { AvatarGroup } from '@/components/big-calendar/components/ui/avatar-group';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/avatar';
import { Button } from '@/components/shadcn/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/shadcn/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shadcn/tabs';
import { cn } from '@/lib/utils';

export function EventFilter() {
  const { users, selectedUserIds, setSelectedUserIds, selectedTypeIds, setSelectedTypeIds } = useCalendar();

  // User handlers
  const handleToggleUser = (userId: string) => {
    if (selectedUserIds === 'all') {
      setSelectedUserIds([userId]);
    } else {
      if (selectedUserIds.includes(userId)) {
        const newSelection = selectedUserIds.filter(id => id !== userId);
        setSelectedUserIds(newSelection);
      } else {
        const newSelection = [...selectedUserIds, userId];
        if (newSelection.length === users.length) {
          setSelectedUserIds('all');
        } else {
          setSelectedUserIds(newSelection);
        }
      }
    }
  };

  const handleToggleAllUsers = () => {
    if (selectedUserIds === 'all') {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds('all');
    }
  };

  // Type handlers
  const handleToggleType = (typeId: string) => {
    if (selectedTypeIds === 'all') {
      setSelectedTypeIds([typeId]);
    } else {
      if (selectedTypeIds.includes(typeId)) {
        const newSelection = selectedTypeIds.filter(id => id !== typeId);
        setSelectedTypeIds(newSelection);
      } else {
        const newSelection = [...selectedTypeIds, typeId];
        if (newSelection.length === calendarTypes.length) {
          setSelectedTypeIds('all');
        } else {
          setSelectedTypeIds(newSelection);
        }
      }
    }
  };

  const handleToggleAllTypes = () => {
    if (selectedTypeIds === 'all') {
      setSelectedTypeIds([]);
    } else {
      setSelectedTypeIds('all');
    }
  };

  const isAllUsersSelected = selectedUserIds === 'all';
  const selectedUserCount = isAllUsersSelected ? users.length : selectedUserIds.length;

  const isAllTypesSelected = selectedTypeIds === 'all';
  const selectedTypeCount = isAllTypesSelected ? calendarTypes.length : selectedTypeIds.length;

  const totalFilters = selectedUserCount + selectedTypeCount;
  const maxFilters = users.length + calendarTypes.length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='outline' className='flex-1 md:w-48 justify-between gap-2'>
          <div className='flex items-center gap-2'>
            <FilterIcon className='w-4 h-4' />
            <span>
              {totalFilters === maxFilters ? 'All Filters' : `${totalFilters} selected`}
            </span>
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent align='end' className='w-80 p-0'>
        <Tabs defaultValue='users' className='w-full'>
          <TabsList className='w-full grid grid-cols-2'>
            <TabsTrigger value='users'>Users ({selectedUserCount})</TabsTrigger>
            <TabsTrigger value='types'>Types ({selectedTypeCount})</TabsTrigger>
          </TabsList>

          <TabsContent value='users' className='p-2 space-y-1'>
            <div
              className={cn(
                'flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer hover:bg-accent',
                isAllUsersSelected && 'bg-accent'
              )}
              onClick={handleToggleAllUsers}
            >
              <div className='flex items-center justify-center w-4 h-4 border rounded-sm border-primary'>
                {isAllUsersSelected && <Check className='w-3 h-3' />}
              </div>
              <div className='flex items-center gap-2 flex-1'>
                <AvatarGroup max={2}>
                  {users.slice(0, 3).map(user => (
                    <Avatar key={user.id} className='size-6 text-xxs'>
                      <AvatarImage src={user.picturePath ?? undefined} alt={user.name} />
                      <AvatarFallback className='text-xxs'>{user.name[0]}</AvatarFallback>
                    </Avatar>
                  ))}
                </AvatarGroup>
                <span className='text-sm'>All Users</span>
              </div>
            </div>

            {users.map(user => {
              const isSelected = isAllUsersSelected || selectedUserIds.includes(user.id);
              return (
                <div
                  key={user.id}
                  className={cn(
                    'flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer hover:bg-accent',
                    isSelected && !isAllUsersSelected && 'bg-accent'
                  )}
                  onClick={() => handleToggleUser(user.id)}
                >
                  <div className='flex items-center justify-center w-4 h-4 border rounded-sm border-primary'>
                    {isSelected && <Check className='w-3 h-3' />}
                  </div>
                  <div className='flex items-center gap-2 flex-1'>
                    <Avatar className='size-6'>
                      <AvatarImage src={user.picturePath ?? undefined} alt={user.name} />
                      <AvatarFallback className='text-xxs'>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <p className='truncate text-sm'>{user.name}</p>
                  </div>
                </div>
              );
            })}
          </TabsContent>

          <TabsContent value='types' className='p-2 space-y-1'>
            <div
              className={cn(
                'flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer hover:bg-accent',
                isAllTypesSelected && 'bg-accent'
              )}
              onClick={handleToggleAllTypes}
            >
              <div className='flex items-center justify-center w-4 h-4 border rounded-sm border-primary'>
                {isAllTypesSelected && <Check className='w-3 h-3' />}
              </div>
              <span className='text-sm flex-1'>All Types</span>
            </div>

            {calendarTypes.map(type => {
              const isSelected = isAllTypesSelected || selectedTypeIds.includes(type.id);
              return (
                <div
                  key={type.id}
                  className={cn(
                    'flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer hover:bg-accent',
                    isSelected && !isAllTypesSelected && 'bg-accent'
                  )}
                  onClick={() => handleToggleType(type.id)}
                >
                  <div className='flex items-center justify-center w-4 h-4 border rounded-sm border-primary'>
                    {isSelected && <Check className='w-3 h-3' />}
                  </div>
                  <div className='flex items-center gap-2 flex-1'>
                    <p className='truncate text-sm'>{type.name}</p>
                  </div>
                </div>
              );
            })}
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
