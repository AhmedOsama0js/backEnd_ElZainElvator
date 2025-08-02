// telegramBot.js
const TelegramBot = require("node-telegram-bot-api");
const TOKEN = process.env.BOT_TOKEN;

const telegramBot = new TelegramBot(TOKEN);

module.exports = { telegramBot };
