import { GetUsersMonthBirthDuesResp } from '@/entities/dues';
import { GetUsersResp } from '@/entities/user';
import { cn } from '@/shared/lib'
import { Gift } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface UserBirthDuesContentProps {
  usersBirthDues?: GetUsersMonthBirthDuesResp[];
  users?: GetUsersResp[];
  className?: string;
}

const UserBirthDuesContent = ({ usersBirthDues, users, className }: UserBirthDuesContentProps) => {
  const { t } = useTranslation('culture');

  return (
    <div className={cn('w-full overflow-x-auto', className)}>
      <div className='grid grid-cols-13 gap-x-2 gap-y-2 text-center text-sm items-center min-w-[780px]'>
        <div className='font-semibold'></div>
        {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
          <div key={month} className='font-semibold'>{t('dues.monthFormat', { month })}</div>
        ))}
        {users?.map((user) => {
          const duesData = usersBirthDues?.find(d => d.dues_user_name === user.user_name);
          const dues = duesData ? duesData.month_birth_dues : Array(12).fill(0);

          return (
            <React.Fragment key={user.user_id}>
              <div className='font-semibold text-left py-1'>{user.user_name}</div>
              {dues.map((value, index) => {
                const birthMonth = user.user_birth ? parseInt(user.user_birth.split('-')[1]) : null;
                const isBirthMonth = birthMonth === index + 1;

                return (
                  <div key={index} className='flex justify-center items-center'>
                    <div className={cn(
                      'relative w-12 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-md text-base',
                      value > 0 ? 'bg-blue-500 dark:bg-blue-600 text-white' : 'bg-muted dark:bg-muted'
                    )}>
                      {isBirthMonth && <Gift className='absolute top-1 left-1 h-3.5 w-3.5' />}
                      {value > 0 && (
                        <span className='font-semibold'>
                          {(value / 10000).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export { UserBirthDuesContent };
