// telegram Bot 선언
require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const schedule = require("node-schedule");
const axios = require("axios");
const { getEvents } = require("./calendarConn");
const { startOfDay, endOfDay, format } = require("date-fns");

const bot = new TelegramBot(process.env.BOT_TOKEN);

const standEventFilter = (events) => {
  const dateVal = `<b>${format(
    new Date(),
    "yyyy년 MM월 dd일"
  )}</b> 스탠드 미팅 시간입니다. \n\n`;
  if (events.length === 0) return `${dateVal}  오늘 휴가자는 없습니다.`;

  return `${dateVal}${events.map((str) => `  ${str}\n`).join("")}`;
};

async function start() {
  // 주간 위클리 - 목요일 오후 4시
  // const job1 = schedule.scheduleJob("53 * * * *", async function () {
  //   const today = new Date();
  //   const startDay = startOfDay(today);
  //   const endDay = endOfDay(today);

  //   const event = await getEvents(startDay, endDay);

  //   // 공휴일은 메세지를 보내지 않는다
  //   if (event === "HOLIDAY") return;

  //   bot.sendMessage(process.env.BOT_ID, "<b>주간 위클리</b> 공유 시간입니다.", {
  //     parse_mode: "HTML",
  //   });
  // });

  // 스탠드 미팅 - 평일 오전 10시
  // const job2 = schedule.scheduleJob("52 15 * * *", async function () {
  const today = new Date();
  const startDay = startOfDay(today);
  const endDay = endOfDay(today);

  const event = await getEvents(startDay, endDay);

  // 공휴일은 메세지를 보내지 않는다
  if (event === "HOLIDAY") return;

  await bot.sendMessage(process.env.BOT_ID, standEventFilter(event), {
    parse_mode: "HTML",
  });

  process.exit();
  // });
}

module.exports = {
  start: start,
};
