const process = require("process");
const { google } = require("googleapis");

const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

const getEvents = async (timeMin, timeMax) => {
  const jwtClient = new google.auth.JWT(
    process.env.GOOGLE_CLIENT_EMAIL,
    null,
    process.env.GOOGLE_PRIVATE_KEY,
    SCOPES
  );

  const calendar = google.calendar({
    version: "v3",
    project: process.env.GOOGLE_PROJECT_NUMBER,
    auth: jwtClient,
  });

  // 공휴일인지 먼저 확인
  const holiday = await calendar.events.list({
    calendarId: process.env.HOLIDAY_CALENDAR_ID,
    timeMin: timeMin.toISOString(),
    timeMax: timeMax.toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: "startTime",
  });

  const holidayEvents = holiday.data.items;

  const holidayChk = holidayEvents.findIndex(
    (event) => event.description === "공휴일"
  );

  if (!holidayChk) return "HOLIDAY";

  const res = await calendar.events.list({
    calendarId: process.env.CALENDAR_ID,
    timeMin: timeMin.toISOString(),
    timeMax: timeMax.toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: "startTime",
  });

  const events = res.data.items;
  if (!events || events.length === 0) {
    return [];
  }
  // console.log("Upcoming 10 events:", events);
  return events.map((event) => {
    return `${event.summary}`;
  });
};

module.exports = {
  getEvents: getEvents,
};
