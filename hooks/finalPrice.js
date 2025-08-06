const finalPrice = function (next) {
  try {
    if (!this.pricing) {
      this.pricing = {};
    }

    const getValidNumber = (val) => {
      const num = Number(val);
      return isNaN(num) || num < 0 ? 0 : num;
    };

    const base = getValidNumber(this.pricing.basePrice);
    const system = getValidNumber(this.pricing.systemPrice);
    const discount = getValidNumber(this.pricing.discount);
    const taxRate = getValidNumber(this.pricing.tax);

    const priceBeforeTax = base + system - discount;
    const taxAmount = priceBeforeTax * (taxRate / 100);

    let final = priceBeforeTax + taxAmount;

    final = final < 0 ? 0 : final;

    this.pricing.finalPrice = Number(final.toFixed(2));
  } catch (err) {
    console.error("❌ خطأ أثناء حساب السعر النهائي:", err.message);
  }

  next();
};

module.exports = finalPrice;
