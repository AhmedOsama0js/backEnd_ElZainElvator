const setExecutionDates = async function (next) {
  if (this.isNew && this.status !== "execution") {
    return next();
  }

  if (!this.isNew && this.isModified("status") && this.status === "execution") {
    return proceed.call(this, next);
  }

  return next();
};

function proceed(next) {
  if (this.executionStages?.stage1?.startDate) {
    return next();
  }

  const totalDuration = this.durationInDays;
  const stageDuration = Math.floor(totalDuration / 3);
  const remainder = totalDuration % 3;

  const today = new Date();
  const stageNames = ["سكة وباب", "مكينه وكبينة", "الكهرباء"];

  let currentStart = new Date(today);
  const executionStages = {};

  for (let i = 0; i < 3; i++) {
    let extraDay = i < remainder ? 1 : 0;
    let duration = stageDuration + extraDay;

    let currentEnd = new Date(currentStart);
    currentEnd.setDate(currentEnd.getDate() + duration - 1);

    executionStages[`stage${i + 1}`] = {
      name: stageNames[i],
      startDate: currentStart,
      endDate: currentEnd,
      completed: false,
      status: i === 0 ? "in_progress" : "pending",
      notes: "",
      productsUsed: [],
    };

    currentStart = new Date(currentEnd);
    currentStart.setDate(currentStart.getDate() + 1);
  }

  this.executionStages = executionStages;
  next();
}

module.exports = setExecutionDates;
