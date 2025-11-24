import RuleAttire from '@/features/culture/rule/components/RuleAttire';
import RuleCulture from '@/features/culture/rule/components/RuleCulture';
import RuleEducation from '@/features/culture/rule/components/RuleEducation';
import RuleHeader from '@/features/culture/rule/components/RuleHeader';
import RuleVacation from '@/features/culture/rule/components/RuleVacation';

const RuleContent = () => {
  return (
    <div className='container mx-auto py-12 px-4 md:px-0 max-w-4xl'>
      <RuleHeader />
      <RuleVacation />
      <RuleAttire />
      <RuleEducation />
      <RuleCulture />
    </div>
  );
};

export default RuleContent;
