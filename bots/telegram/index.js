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

async function standMeeting() {
  const today = new Date();

  const startDay = startOfDay(today);
  const endDay = endOfDay(today);

  const event = await getEvents(startDay, endDay);

  bot.sendMessage(process.env.BOT_ID, standEventFilter(event), {
    parse_mode: "HTML",
  });
}

function weekly() {
  const today = new Date();

  bot.sendMessage(process.env.BOT_ID, "주간 위클리 공유 시간입니다.", {
    parse_mode: "HTML",
  });
}

module.exports = {
  standMeeting: standMeeting,
  weekly: weekly,
};
