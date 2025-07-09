const setExecutionDates = function (next) {
  if (!this.startDate) {
    this.startDate = new Date();
  }

  if (!this.endDate) {
    const end = new Date(this.startDate);
    end.setDate(end.getDate() + 15);
    this.endDate = end;
  }

  next();
};

module.exports = setExecutionDates;
