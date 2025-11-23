import RuleAttire from './RuleAttire';
import RuleCulture from './RuleCulture';
import RuleEducation from './RuleEducation';
import RuleHeader from './RuleHeader';
import RuleVacation from './RuleVacation';

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
