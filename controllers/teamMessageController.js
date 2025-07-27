const ApiError = require("../utils/ApiError");
const asyncHandler = require("express-async-handler");
const TelegramBot = require("node-telegram-bot-api");
const TOKEN = process.env.BOT_TOKEN;
const chatIds = process.env.CHAT_IDS.split(",");
const bot = new TelegramBot(TOKEN, { polling: true });

exports.sendMessage = asyncHandler(async (req, res, next) => {
  const { name, phone, message } = req.body;

  if (!name || !phone || !message) {
    return next(new ApiError("يرجى إرسال الاسم ورقم الهاتف والرسالة", 400));
  }

  const now = new Date();

  const days = [
    "الأحد",
    "الإثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
    "السبت",
  ];
  const dayName = days[now.getDay()];

  const date = now.toLocaleDateString("ar-EG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const time = now.toLocaleTimeString("ar-EG", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  // شكل التوقيت النهائي
  const formattedDateTime = `🗓️ ${dayName} ${date} • ⏰ ${time}`;
  // ✅ شكل الرسالة المحترف
  const text = `
<b>📩 رسالة جديدة من الموقع</b>
  <pre>${formattedDateTime}</pre>

👤 <u><b> بيانات العميل: </b></u>
• <b>الاسم بالكامل: </b> <i>${name}</i>
• <b>رقم الهاتف: </b> <code>${phone}</code>

📝 <b>المحتوى:</b>
 <blockquote>
<pre>${message}</pre>
</blockquote>
`;

  // إرسال الرسالة
  const results = [];

  for (const id of chatIds) {
    try {
      await bot.sendMessage(id.trim(), text, {
        parse_mode: "HTML",
        disable_web_page_preview: true,
      });
      results.push({ id: id.trim(), status: "success" });
    } catch (error) {
      console.error(`❌ فشل إرسال الرسالة إلى ${id}:`, error.message);
      results.push({ id: id.trim(), status: "failed", error: error.message });
    }
  }

  res.status(200).json({
    status: "success",
    message: `✅ تم إرسال الرسالة بنجاح.`,
  });
});
