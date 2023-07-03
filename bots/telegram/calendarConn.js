const fs = require("fs").promises;
const path = require("path");
const process = require("process");
const { authenticate } = require("@google-cloud/local-auth");
const { google } = require("googleapis");

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), "token.json");
const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file compatible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: "authorized_user",
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  const content = await fs.readFile(CREDENTIALS_PATH);
  console.log("CREDENTIALS_PATH ::", CREDENTIALS_PATH);
  console.log("content ::", content);
  const keys = JSON.parse(content);
  console.log("keys ::", keys);
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
const getEvents = async (timeMin, timeMax) => {
  const auth = await authorize();

  const calendar = google.calendar({ version: "v3", auth });

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
  // console.log("events ::", events);
  if (!events || events.length === 0) {
    return [];
  }
  console.log("Upcoming 10 events:", events);
  return events.map((event) => {
    return `${event.summary}`;
  });
};

module.exports = {
  getEvents: getEvents,
};
// authorize().then(listEvents).catch(console.error);
