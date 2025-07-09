function getCurrentTimeWithMilliseconds() {
  const now = new Date();

  const daysAr = [
    "الأحد",
    "الاثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
    "السبت",
  ];

  const dayName = daysAr[now.getDay()];
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();

  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const milliseconds = String(now.getMilliseconds()).padStart(3, "0");

  const isPM = hours >= 12;
  const ampm = isPM ? "مساءً" : "صباحًا";
  hours = hours % 12;
  hours = hours === 0 ? 12 : hours;
  const formattedHours = String(hours).padStart(2, "0");

  return `${dayName}، ${day}/${month}/${year} - ${formattedHours}:${minutes}:${seconds}.${milliseconds} ${ampm}`;
}

module.exports = { getCurrentTimeWithMilliseconds };
