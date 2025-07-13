const setExecutionDates = function (next) {
  if (!this.isNew) return next();

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
      status: "pending",
      notes: "",
      productsUsed: [],
    };

    currentStart = new Date(currentEnd);
    currentStart.setDate(currentStart.getDate() + 1);
  }

  this.executionStages = executionStages;

  next();
};

module.exports = setExecutionDates;
