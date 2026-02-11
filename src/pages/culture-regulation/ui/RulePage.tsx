import { RuleContent } from '@/features/culture-regulation/ui/RuleContent';
import { RuleProvider } from '@/features/culture-regulation/model/RuleContext';

const RulePage = () => {
  return (
    <RuleProvider>
      <RuleContent />
    </RuleProvider>
  );
};

export { RulePage };