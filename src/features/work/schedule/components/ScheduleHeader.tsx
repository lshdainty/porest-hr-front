import { useTranslation } from 'react-i18next';

const ScheduleHeader = () => {
  const { t } = useTranslation('work');
  return (
    <div className="flex flex-col gap-4 mb-6">
      <h1 className="text-3xl font-bold">{t('schedule.title')}</h1>
    </div>
  );
};

export { ScheduleHeader }
