import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/shadcn/hoverCard';

export default function Rule() {
  return (
    <div className='container mx-auto py-12 px-4 md:px-0 max-w-4xl'>
      <div className='text-center mb-12'>
        <h1 className='text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-card-foreground leading-tight mb-4'>
          💁 POREST 🌲
        </h1>
        <p className='text-lg md:text-xl text-gray-600 dark:text-card-foreground'>
          POREST팀은 이용자분들의 복지를 개선하기 위해 항상 노력하고 있어요
        </p>
      </div>
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
                휴가는
                <HoverCard>
                  <HoverCardTrigger> <b><u>분기</u></b></HoverCardTrigger>
                  <HoverCardContent className='text-sm text-gray-600 dark:text-card-foreground'>
                    1분기: 4일<br />
                    2분기: 4일<br />
                    3분기: 4일<br />
                    4분기: 3일<br />
                  </HoverCardContent>
                </HoverCard>
                마다 제공되고 누적이 되지만 해당년도에 모두 소진해야 해요.
              </p>
            </div>
          </div>
          <div className='bg-card rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-lg'>
            <img src='/rule_1_3.png' alt='rule_1_3' className='w-full h-48 object-cover' />
            <div className='p-5'>
              <h3 className='text-lg font-semibold text-gray-800 dark:text-card-foreground mb-2'>경조 휴가</h3>
              <p className='text-sm text-gray-600 dark:text-card-foreground line-clamp-4'>
                <HoverCard>
                  <HoverCardTrigger><b><u>기쁠 때</u></b></HoverCardTrigger>
                  <HoverCardContent className='text-sm text-gray-600 dark:text-card-foreground'>
                    🤵👰결혼: 5일<br/>
                    🤱출산: 10일<br/>
                  </HoverCardContent>
                </HoverCard>
                나 
                <HoverCard>
                  <HoverCardTrigger> <b><u>슬플 때</u></b> </HoverCardTrigger>
                  <HoverCardContent className='text-sm text-gray-600 dark:text-card-foreground'>
                    🙇부친상, 모친상: 5일<br/>
                    🙇빙부,빙모,시부,시모상: 3일<br/>
                  </HoverCardContent>
                </HoverCard>
                경조 휴가가 지급돼요. 운영팀은 항상 함께하고 있어요.
              </p>
            </div>
          </div>
          <div className='bg-card rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-lg'>
            <img src='/rule_1_4.png' alt='rule_1_4' className='w-full h-48 object-cover' />
            <div className='p-5'>
              <h3 className='text-lg font-semibold text-gray-800 dark:text-card-foreground mb-2'>기타 휴가</h3>
              <p className='text-sm text-gray-600 dark:text-card-foreground line-clamp-4'>
                <HoverCard>
                  <HoverCardTrigger>🏥<b><u>건강검진</u></b>,</HoverCardTrigger>
                  <HoverCardContent className='text-sm text-gray-600 dark:text-card-foreground'>
                    2년에 한번 반차<br/>
                  </HoverCardContent>
                </HoverCard>
                <HoverCard>
                  <HoverCardTrigger> 💂‍♂️<b><u>예비군(민방위)</u></b> </HoverCardTrigger>
                  <HoverCardContent className='text-sm text-gray-600 dark:text-card-foreground'>
                    동원 훈련: 3일<br/>
                    동미참 훈련: 1일<br/>
                  </HoverCardContent>
                </HoverCard>
                대상자는 당연히 유급 휴가예요.
              </p>
            </div>
          </div>
        </div>
      </div>
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
                <HoverCard>
                  <HoverCardTrigger> <b><u>빠른 퇴근</u></b></HoverCardTrigger>
                  <HoverCardContent className='text-sm text-gray-600 dark:text-card-foreground'>
                    서울 거주자: 1시간,<br/>
                    서울외 거주자: 1시간 30분
                  </HoverCardContent>
                </HoverCard>하세요!
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
                <HoverCard>
                  <HoverCardTrigger> <b><u>빠른 퇴근</u></b></HoverCardTrigger>
                  <HoverCardContent className='text-sm text-gray-600 dark:text-card-foreground'>
                    서울 거주자: 1시간,<br/>
                    서울외 거주자: 1시간 30분
                  </HoverCardContent>
                </HoverCard>하세요!
              </p>
            </div>
          </div>
          <div className='bg-card rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-lg'>
            <img src='/rule_4_4.png' alt='rule_4_4' className='w-full h-48 object-cover' />
            <div className='p-5'>
              <h3 className='text-lg font-semibold text-gray-800 dark:text-card-foreground mb-2'>기타사항</h3>
              <p className='text-sm text-gray-600 dark:text-card-foreground line-clamp-4'>
                조기 퇴근은
                <HoverCard>
                  <HoverCardTrigger> <b><u>본인 및 가족</u></b></HoverCardTrigger>
                  <HoverCardContent className='text-sm text-gray-600 dark:text-card-foreground'>
                    가족 범위<br/>
                    🤵‍♂️남편, 👰‍♀️아내, 👶자녀까지 해당돼요<br/>
                    👴,👵부모님, 👫연인은 해당안돼요.
                  </HoverCardContent>
                </HoverCard>만 해당해요. 단 기념일이 공휴일이거나 주말인 경우엔 해당되지 않아요.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};