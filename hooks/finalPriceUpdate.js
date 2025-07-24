const finalPriceUpdate = function (next) {
  const update = this.getUpdate();

  if (update?.pricing) {
    const getValidNumber = (val) => {
      const num = Number(val);
      return isNaN(num) || num < 0 ? 0 : num;
    };

    const base = getValidNumber(update.pricing.basePrice);
    const system = getValidNumber(update.pricing.systemPrice);
    const discount = getValidNumber(update.pricing.discount);
    const tax = getValidNumber(update.pricing.tax);

    let final = base + system - discount + tax;
    final = final < 0 ? 0 : final;

    update.pricing.finalPrice = Number(final.toFixed(2));

    this.setUpdate(update); // لازم تعيد التحديث بعد التعديل
  }

  next();
};

module.exports = finalPriceUpdate;
