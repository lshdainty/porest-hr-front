import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/shadcn/hoverCard';

const RuleEducation = () => {
  return (
    <div className='mb-12'>
      <h2 className='text-2xl md:text-3xl font-bold text-gray-800 dark:text-card-foreground mb-6'>
        👨‍💻 교육 & OT
      </h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
        <div className='bg-card rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-lg'>
          <img src='/rule_3_1.png' alt='rule_3_1' className='w-full h-48 object-cover' />
          <div className='p-5'>
            <h3 className='text-lg font-semibold text-gray-800 dark:text-card-foreground mb-2'>자기개발</h3>
            <p className='text-sm text-gray-600 dark:text-card-foreground line-clamp-4'>
              일할 때는 확실하게, 일이 없다면 휴대폰은 잠시 내려두고 📖독서와 👨‍💻공부를 해보아요. 자기개발을 지향해요.
            </p>
          </div>
        </div>
        <div className='bg-card rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-lg'>
          <img src='/rule_3_2.png' alt='rule_3_2' className='w-full h-48 object-cover' />
          <div className='p-5'>
            <h3 className='text-lg font-semibold text-gray-800 dark:text-card-foreground mb-2'>외부교육</h3>
            <p className='text-sm text-gray-600 dark:text-card-foreground line-clamp-4'>
              <HoverCard>
                <HoverCardTrigger>🧑‍🏫<b><u>외부 컨퍼런스</u></b></HoverCardTrigger>
                <HoverCardContent className='text-sm text-gray-600 dark:text-card-foreground'>
                  SK AI Summit, AWS summit 등
                </HoverCardContent>
              </HoverCard>
              에 참여해서 최신 트랜드를 파악해봐요. 최대 연 2회, 기간이 최대 3일 이내면 출근으로 인정돼요.
            </p>
          </div>
        </div>
        <div className='bg-card rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-lg'>
          <img src='/rule_3_3.png' alt='rule_3_3' className='w-full h-48 object-cover' />
          <div className='p-5'>
            <h3 className='text-lg font-semibold text-gray-800 dark:text-card-foreground mb-2'>연장근무</h3>
            <p className='text-sm text-gray-600 dark:text-card-foreground line-clamp-4'>
              운영환경 특성상 🌙야간 작업, 주말 작업 등이 발생할 수 있어요.
            </p>
          </div>
        </div>
        <div className='bg-card rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-lg'>
          <img src='/rule_3_4.png' alt='rule_3_4' className='w-full h-48 object-cover' />
          <div className='p-5'>
            <h3 className='text-lg font-semibold text-gray-800 dark:text-card-foreground mb-2'>추가 휴가</h3>
            <p className='text-sm text-gray-600 dark:text-card-foreground line-clamp-4'>
              SK AX와 동일하게 야간, 주말 초과 근무에 대한 휴가가 부여돼요. 
              <HoverCard>
                <HoverCardTrigger> <b><u>대기 시간</u></b></HoverCardTrigger>
                <HoverCardContent className='text-sm text-gray-600 dark:text-card-foreground'>
                  시스템 반영, 시스템 재부팅 등 작업과 관련없는 시간
                </HoverCardContent>
              </HoverCard>을 제외하고 
              <HoverCard>
                <HoverCardTrigger> <b><u>1시간 단위</u></b></HoverCardTrigger>
                <HoverCardContent className='text-sm text-gray-600 dark:text-card-foreground'>
                  ex&#41;<br/>
                  1시간 50분 -&gt; 1시간 부여,<br/>
                  2시간 10분 -&gt; 2시간 부여
                </HoverCardContent>
              </HoverCard>로 부여하고 있어요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RuleEducation;
