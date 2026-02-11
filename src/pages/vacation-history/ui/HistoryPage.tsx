import { HistoryContent } from '@/features/vacation-history/ui/HistoryContent'
import { HistoryProvider } from '@/features/vacation-history/model/HistoryContext'

const HistoryPage = () => {
  return (
    <HistoryProvider>
      <HistoryContent />
    </HistoryProvider>
  )
};

export { HistoryPage };
