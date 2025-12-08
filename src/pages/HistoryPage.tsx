import { HistoryContent } from '@/features/vacation/history/components/HistoryContent'
import { HistoryProvider } from '@/features/vacation/history/contexts/HistoryContext'

const HistoryPage = () => {
  return (
    <HistoryProvider>
      <HistoryContent />
    </HistoryProvider>
  )
};

export { HistoryPage };
