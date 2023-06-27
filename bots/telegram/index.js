// telegram Bot 선언
require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const schedule = require("node-schedule");
const axios = require("axios");
const getEvents = require("./calendarConn");

// 텔레그램 봇을 생성하고, polling 방식으로 메세지를 가져옴
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

const arrayFilter = (arr) => {
  const dateVal = `<b>${new Date().getFullYear()}년 ${
    new Date().getMonth() + 1
  }월 ${new Date().getDate()}일</b> 스탠드 미팅 시간입니다. \n\n`;
  if (arr.length === 0) return `${dateVal}오늘 휴가자는 없습니다.`;

  return `${dateVal}${arr.map((str) => `  ${str}\n`).join("")}`;
};

async function start() {
  // schedule.scheduleJob("1 1 10 * * *", async function () {
  //   const event = await getEvents();

  //   bot.sendMessage(process.env.BOT_ID, arrayFilter(event));
  // });

  const event = await getEvents();

  bot.sendMessage(process.env.BOT_ID, arrayFilter(event), {
    parse_mode: "HTML",
  });

  // const event = ["조옥상", "조옥상", "조옥상", "조옥상", "조옥상"];
  // const event = await getEvents();

  // console.log("event ::", event);

  // '/echo' 라는 명령어가 오면, 로직 수행 후 => 따라 말한다.
  bot.onText(/\/echo (.+)/, (msg, match) => {
    // 'msg' : 텔레그램으로 부터 수신한 메세지
    // 'match' : 정규식을 실행한 결과

    const chatId = msg.chat.id;
    const resp = "따라하기 : " + match[1];

    bot.sendMessage(chatId, resp);
  });

  // .on('message')을 통해 bot이 어떤 메세지든 수신하도록 해줌
  bot.on("message", (msg) => {
    const chatId = msg.chat.id;
    console.log(chatId);
    // send a message to the chat acknowledging receipt of their message
    bot.sendMessage(chatId, "메세지 수신 완료!");
  });
}

module.exports = {
  start: start,
};
