const mongoose = require("mongoose");

const assignContractNumber = async function (next) {
  if (this.contract.number) return next();

  const year = new Date().getFullYear();

  const lastProject = await mongoose
    .model("Project")
    .findOne({
      "contract.date": {
        $gte: new Date(`${year}-01-01`),
        $lte: new Date(`${year}-12-31`),
      },
    })
    .sort({ "contract.seq": -1 })
    .select("contract.seq");

  const nextSeq = lastProject ? lastProject.contract.seq + 1 : 1;
  const serial = String(nextSeq).padStart(3, "0");
  const number = `C-${year}-${serial}`;

  const exists = await mongoose.model("Project").findOne({
    "contract.number": number,
  });

  if (exists) {
    return next(new Error("حدث تكرار في رقم العقد، حاول مرة أخرى"));
  }

  this.contract.seq = nextSeq;
  this.contract.number = number;

  next();
};

module.exports = assignContractNumber;
