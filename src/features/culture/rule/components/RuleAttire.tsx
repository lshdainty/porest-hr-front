import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/shadcn/hoverCard';

const RuleAttire = () => {
  return (
    <div className='mb-12'>
      <h2 className='text-2xl md:text-3xl font-bold text-gray-800 dark:text-card-foreground mb-6'>
        👔 복장
      </h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
        <div className='bg-card rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-lg'>
          <img src='/rule_2_1.png' alt='rule_2_1' className='w-full h-48 object-cover' />
          <div className='p-5'>
            <h3 className='text-lg font-semibold text-gray-800 dark:text-card-foreground mb-2'>기본 복장</h3>
            <p className='text-sm text-gray-600 dark:text-card-foreground line-clamp-4'>
              👕단정한 옷차림을 지향해요. 더운 날엔 반바지입고 편안하게 출근하세요.
            </p>
          </div>
        </div>
        <div className='bg-card rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-lg'>
          <img src='/rule_2_2.png' alt='rule_2_2' className='w-full h-48 object-cover' />
          <div className='p-5'>
            <h3 className='text-lg font-semibold text-gray-800 dark:text-card-foreground mb-2'>외부 미팅</h3>
            <p className='text-sm text-gray-600 dark:text-card-foreground line-clamp-4'>
              👔고객 미팅, 공식 행사 시에는 긴바지와 깔끔한 옷차림을 착용하여 전문성을 보여줘요.
            </p>
          </div>
        </div>
        <div className='bg-card rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-lg'>
          <img src='/rule_2_3.png' alt='rule_2_3' className='w-full h-48 object-cover' />
          <div className='p-5'>
            <h3 className='text-lg font-semibold text-gray-800 dark:text-card-foreground mb-2'>현장 출장</h3>
            <p className='text-sm text-gray-600 dark:text-card-foreground line-clamp-4'>
              🏭생산 현장은 안전제일!<br/> 긴바지와 운동화가 필수예요.
            </p>
          </div>
        </div>
        <div className='bg-card rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-lg'>
          <img src='/rule_2_4.png' alt='rule_2_4' className='w-full h-48 object-cover' />
          <div className='p-5'>
            <h3 className='text-lg font-semibold text-gray-800 dark:text-card-foreground mb-2'>지양 복장</h3>
            <p className='text-sm text-gray-600 dark:text-card-foreground line-clamp-4'>
              🚫과도한 노출이나 불쾌감을 줄 수 있는 
              <HoverCard>
                <HoverCardTrigger> <b><u>복장</u></b></HoverCardTrigger>
                <HoverCardContent className='text-sm text-gray-600 dark:text-card-foreground'>
                  👔셔츠는 단추 잠구기<br/>
                  🙅‍♂️운동복, 츄리닝 안돼요!<br/>
                  🩴슬리퍼, 크록스 안돼요!<br/>
                </HoverCardContent>
              </HoverCard>
              은 피해주세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RuleAttire;
