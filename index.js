const TelegramApi = require("node-telegram-bot-api");
const { gameOptions, againOptions } = require("./options");
require("dotenv").config();

const bot = new TelegramApi(process.env.BOT_TOKEN, { polling: true });

bot.setMyCommands([
  { command: "/start", description: "Реєстрація на бота" },
  { command: "/info", description: "Інформація про тебе" },
  { command: "/game", description: "Давай грати" },
]);

const chats = {};

const startGame = async (chatId) => {
  await bot.sendSticker(
    chatId,
    "https://tlgrm.ru/_/stickers/a67/687/a67687d7-a192-4eec-a91c-96b36966ba89/4.webp"
  );
  await bot.sendMessage(
    chatId,
    "Давай пограємо у гру,  я загадаю цифру від 0 до 9"
  );
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, "Відгадуй)", gameOptions);
};

const start = () => {
  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === "/start") {
      await bot.sendMessage(chatId, "І нашо ти це зробив???");
      return bot.sendSticker(
        chatId,
        "https://tlgrm.ru/_/stickers/cb8/a14/cb8a144e-592c-4fc7-b84c-f76e93debacc/1.webp"
      );
    }
    if (text === "/info") {
      return bot.sendMessage(
        chatId,
        `Тебе звати фінтіплюх... Та жартую, ти ${msg.from.first_name}`
      );
    }

    if (text === "/game") {
      return startGame(chatId);
    }

    return (
      bot.sendSticker(
        chatId,
        "https://tlgrm.ru/_/stickers/cb8/a14/cb8a144e-592c-4fc7-b84c-f76e93debacc/58.webp"
      ),
      bot.sendMessage(chatId, "Моя твоя не понімать!..")
    );
  });

  bot.on("callback_query", async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;

    if (data === "/again") {
      return startGame(chatId);
    }
    await bot.sendMessage(chatId, `Ти вибрав кнопку ${data}`);

    if (Number(data) === chats[chatId]) {
      return await bot.sendMessage(
        chatId,
        `Цього разу ти вгадав цифру ${chats[chatId]}`,
        againOptions
      );
    } else {
      return bot.sendMessage(
        chatId,
        `Хе-хе,  Ти помилився, я загадав ${chats[chatId]}`,
        againOptions
      );
    }
  });
};

start();
