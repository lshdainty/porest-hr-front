import { Popover, PopoverContent, PopoverTrigger } from '@/components/shadcn/popover';

const RuleCulture = () => {
  return (
    <div className='mb-12'>
      <h2 className='text-2xl md:text-3xl font-bold text-gray-800 dark:text-card-foreground mb-6'>
        🥳 조직문화
      </h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
        <div className='bg-card rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-lg'>
          <img src='/rule_4_1.png' alt='rule_4_1' className='w-full h-48 object-cover' />
          <div className='p-5'>
            <h3 className='text-lg font-semibold text-gray-800 dark:text-card-foreground mb-2'>생일</h3>
            <p className='text-sm text-gray-600 dark:text-card-foreground line-clamp-4'>
              😄 당신은 사랑받기 위해 태어난 사람~ 생일을 축하드리며
              <Popover>
                <PopoverTrigger>&nbsp;<b><u>빠른 퇴근</u></b></PopoverTrigger>
                <PopoverContent className='text-sm text-gray-600 dark:text-card-foreground'>
                  서울 거주자: 1시간,<br/>
                  서울외 거주자: 1시간 30분
                </PopoverContent>
              </Popover>하세요!
            </p>
          </div>
        </div>
        <div className='bg-card rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-lg'>
          <img src='/rule_4_2.png' alt='rule_4_2' className='w-full h-48 object-cover' />
          <div className='p-5'>
            <h3 className='text-lg font-semibold text-gray-800 dark:text-card-foreground mb-2'>생일파티</h3>
            <p className='text-sm text-gray-600 dark:text-card-foreground line-clamp-4'>
              한 달에 한 번 SK AX에서 제공하는 🎂케이크와 함께 팀원들이 구매한 🎁선물을 전달하는 🎉생일 파티를 진행해요
            </p>
          </div>
        </div>
        <div className='bg-card rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-lg'>
          <img src='/rule_4_3.png' alt='rule_4_3' className='w-full h-48 object-cover' />
          <div className='p-5'>
            <h3 className='text-lg font-semibold text-gray-800 dark:text-card-foreground mb-2'>가족기념일</h3>
            <p className='text-sm text-gray-600 dark:text-card-foreground line-clamp-4'>
              가족생일, 결혼기념일엔 가족과 함께 보내야죠! 이 날도
              <Popover>
                <PopoverTrigger>&nbsp;<b><u>빠른 퇴근</u></b></PopoverTrigger>
                <PopoverContent className='text-sm text-gray-600 dark:text-card-foreground'>
                  서울 거주자: 1시간,<br/>
                  서울외 거주자: 1시간 30분
                </PopoverContent>
              </Popover>하세요!
            </p>
          </div>
        </div>
        <div className='bg-card rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-lg'>
          <img src='/rule_4_4.png' alt='rule_4_4' className='w-full h-48 object-cover' />
          <div className='p-5'>
            <h3 className='text-lg font-semibold text-gray-800 dark:text-card-foreground mb-2'>기타사항</h3>
            <p className='text-sm text-gray-600 dark:text-card-foreground line-clamp-4'>
              조기 퇴근은
              <Popover>
                <PopoverTrigger>&nbsp;<b><u>본인 및 가족</u></b></PopoverTrigger>
                <PopoverContent className='text-sm text-gray-600 dark:text-card-foreground'>
                  가족 범위<br/>
                  🤵‍♂️남편, 👰‍♀️아내, 👶자녀까지 해당돼요<br/>
                  👴,👵부모님, 👫연인은 해당안돼요.
                </PopoverContent>
              </Popover>만 해당해요. 단 기념일이 공휴일이거나 주말인 경우엔 해당되지 않아요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RuleCulture;
