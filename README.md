# telegram-bot

> 사용한 기능 및 라이브러리
- Git Actions (코드 실행)
- node-telegram-bot-api (텔레그램과 연결)
- date-fns (날짜 계산)
<br/>
<br/>

> 개발 목적

텔레그램에서 특정 시간마다 알림 메세지를 주기 위해 개발 하였습니다.

<br/>
<br/>

> 기능

- 평일 오전 10시마다 스탠딩 미팅 시간이라는 글과 함께
구글 캘린더에서 금일 휴가자 리스트를 보여줍니다.
<br/>

  ````
  const res = await calendar.events.list({
    calendarId: process.env.CALENDAR_ID, // 가져올 구글 캘린더 ID 
    timeMin: timeMin.toISOString(), // 가져올 시작 시간 ~
    timeMax: timeMax.toISOString(), // 가져올 ~ 끝 시간
    maxResults: 10, // 최대 갯수
    singleEvents: true, // 반복 이벤트를 반환 할건지 여부
    orderBy: "startTime", // 정렬 형식
  });
  ````
  
<br/>
<img width="821" alt="image" src="https://github.com/chorooftop/telegram-bot/assets/121594406/9944d6b8-f678-4166-9f7e-f5d16ec0a778">

<br/>
<br/>
<br/>
<br/>
<br/>
<br/>

- 휴가자가 없을 때는 없음 메세지를 보여줍니다.
<br/>

  ````
    // 가져온 events가 없을 경우 
  const dateVal = `<b>${format(
    new Date(),
    "yyyy년 MM월 dd일"
  )}</b> 스탠드 미팅 시간입니다. \n\n`;
  
  if (events.length === 0) return `${dateVal}  오늘 휴가자는 없습니다.`;
  ````
  
<br/>
<img width="331" alt="image" src="https://github.com/chorooftop/telegram-bot/assets/121594406/1e608404-1ca0-48b0-a250-e1251aeee354">

<br/>
<br/>
<br/>
<br/>
<br/>
<br/>


- 공휴일 및 주말에는 메세지를 전송하지 않습니다.
  ````
    // 구글캘린더에서 공휴일 CALENDAR_ID 적용
    calendarId: process.env.HOLIDAY_CALENDAR_ID
  ````




 
