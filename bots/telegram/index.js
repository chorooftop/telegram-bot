// telegram Bot 선언
require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const schedule = require("node-schedule");
const axios = require("axios");
const { getEvents } = require("./calendarConn");
const { startOfDay, endOfDay, format, addDays } = require("date-fns");

// 텔레그램 봇을 생성하고, polling 방식으로 메세지를 가져옴
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

const standEventFilter = (events) => {
  const dateVal = `<b>${format(
    new Date(),
    "yyyy년 MM월 dd일"
  )}</b> 스탠드 미팅 시간입니다. \n\n`;
  if (events.length === 0) return `${dateVal}  오늘 휴가자는 없습니다.`;

  return `${dateVal}${events.map((str) => `  ${str}\n`).join("")}`;
};

const vacationEventFilter = (events, dateTime, dayVal) => {
  const dateVal = `<b>${format(dateTime, "yyyy년 MM월 dd일")}</b> \n\n`;
  if (events.length === 0) return `${dateVal} ${dayVal} 휴가자는 없습니다.`;

  return `${dateVal}${events.map((str) => `  ${str}\n`).join("")}`;
};

const startAndEndDayFormat = (dayVal) => {
  const today = new Date();

  switch (dayVal) {
    case "어제":
      return {
        startDay: startOfDay(addDays(today, -1)),
        endDay: endOfDay(addDays(today, -1)),
      };
    case "오늘":
      return {
        startDay: startOfDay(today),
        endDay: endOfDay(today),
      };
    case "내일":
      return {
        startDay: startOfDay(addDays(today, 1)),
        endDay: endOfDay(addDays(today, 1)),
      };
  }
};

async function start() {
  // schedule.scheduleJob("1 1 10 * * *", async function () {
  //   const event = await getEvents();

  //   bot.sendMessage(process.env.BOT_ID, arrayFilter(event));
  // });

  const { startDay, endDay } = startAndEndDayFormat("오늘");

  const event = await getEvents(startDay, endDay);

  bot.sendMessage(process.env.BOT_ID, standEventFilter(event), {
    parse_mode: "HTML",
  });

  // '/00휴가' 라는 명령어가 오면, 날짜에 맞는 휴가자 출력
  bot.onText(/\/(어제|오늘|내일)휴가$/, async (msg, match) => {
    // 'msg' : 텔레그램으로 부터 수신한 메세지
    // 'match' : 정규식을 실행한 결과

    const dayVal = match[1];

    const { startDay, endDay } = startAndEndDayFormat(dayVal);

    // const chatId = msg.chat.id;

    const event = await getEvents(startDay, endDay);

    bot.sendMessage(
      process.env.BOT_ID,
      vacationEventFilter(event, startDay, dayVal),
      {
        parse_mode: "HTML",
      }
    );
  });

  // .on('message')을 통해 bot이 어떤 메세지든 수신하도록 해줌
  // bot.on("message", (msg) => {
  //   const chatId = msg.chat.id;
  //   console.log(chatId);
  //   // send a message to the chat acknowledging receipt of their message
  //   bot.sendMessage(chatId, "메세지 수신 완료!");
  // });
}

module.exports = {
  start: start,
};
