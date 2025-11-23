import RuleContent from '@/features/culture/rule/components/RuleContent';
import { RuleProvider } from '@/features/culture/rule/contexts/RuleContext';

const RulePage = () => {
  return (
    <RuleProvider>
      <RuleContent />
    </RuleProvider>
  );
};

export default RulePage;