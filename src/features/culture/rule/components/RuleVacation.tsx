import { Popover, PopoverContent, PopoverTrigger } from '@/components/shadcn/popover';

const RuleVacation = () => {
  return (
    <div className='mb-12'>
      <h2 className='text-2xl md:text-3xl font-bold text-gray-800 dark:text-card-foreground mb-6'>
        🏖️ 휴가
      </h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
        <div className='bg-card rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-lg'>
          <img src='/rule_1_1.png' alt='rule_1_1' className='w-full h-48 object-cover' />
          <div className='p-5'>
            <h3 className='text-lg font-semibold text-gray-800 dark:text-card-foreground mb-2'>휴가 일수</h3>
            <p className='text-sm text-gray-600 dark:text-card-foreground line-clamp-4'>
              휴가는 📅1년에 <b><u>총 15일</u></b> 지급으로 🕐<b><u>1시간 단위</u></b>로 자유롭게 사용 가능해요.
            </p>
          </div>
        </div>
        <div className='bg-card rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-lg'>
          <img src='/rule_1_2.png' alt='rule_1_2' className='w-full h-48 object-cover' />
          <div className='p-5'>
            <h3 className='text-lg font-semibold text-gray-800 dark:text-card-foreground mb-2'>지급 시기</h3>
            <p className='text-sm text-gray-600 dark:text-card-foreground line-clamp-4'>
              휴가는&nbsp;
              <Popover>
                <PopoverTrigger><b><u>분기</u></b></PopoverTrigger>
                <PopoverContent className='text-sm text-gray-600 dark:text-card-foreground'>
                  1분기: 4일<br />
                  2분기: 4일<br />
                  3분기: 4일<br />
                  4분기: 3일<br />
                </PopoverContent>
              </Popover>
              마다 제공되고 누적이 되지만 해당년도에 모두 소진해야 해요.
            </p>
          </div>
        </div>
        <div className='bg-card rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-lg'>
          <img src='/rule_1_3.png' alt='rule_1_3' className='w-full h-48 object-cover' />
          <div className='p-5'>
            <h3 className='text-lg font-semibold text-gray-800 dark:text-card-foreground mb-2'>경조 휴가</h3>
            <p className='text-sm text-gray-600 dark:text-card-foreground line-clamp-4'>
              <Popover>
                <PopoverTrigger><b><u>기쁠 때</u></b></PopoverTrigger>
                <PopoverContent className='text-sm text-gray-600 dark:text-card-foreground'>
                  🤵👰결혼: 5일<br/>
                  🤱출산: 10일<br/>
                </PopoverContent>
              </Popover>
              나 
              <Popover>
                <PopoverTrigger>&nbsp;<b><u>슬플 때</u></b>&nbsp;</PopoverTrigger>
                <PopoverContent className='text-sm text-gray-600 dark:text-card-foreground'>
                  🙇부친상, 모친상: 5일<br/>
                  🙇빙부,빙모,시부,시모상: 3일<br/>
                </PopoverContent>
              </Popover>
              경조 휴가가 지급돼요. 운영팀은 항상 함께하고 있어요.
            </p>
          </div>
        </div>
        <div className='bg-card rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-lg'>
          <img src='/rule_1_4.png' alt='rule_1_4' className='w-full h-48 object-cover' />
          <div className='p-5'>
            <h3 className='text-lg font-semibold text-gray-800 dark:text-card-foreground mb-2'>기타 휴가</h3>
            <p className='text-sm text-gray-600 dark:text-card-foreground line-clamp-4'>
              <Popover>
                <PopoverTrigger>🏥<b><u>건강검진</u></b>,</PopoverTrigger>
                <PopoverContent className='text-sm text-gray-600 dark:text-card-foreground'>
                  2년에 한번 반차<br/>
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger>&nbsp;💂‍♂️<b><u>예비군(민방위)</u></b>&nbsp;</PopoverTrigger>
                <PopoverContent className='text-sm text-gray-600 dark:text-card-foreground'>
                  동원 훈련: 3일<br/>
                  동미참 훈련: 1일<br/>
                </PopoverContent>
              </Popover>
              대상자는 당연히 유급 휴가예요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RuleVacation;
