class ApiFetcher {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludeFields = ["page", "sort", "limit", "keyword"];
    excludeFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  search() {
    if (this.queryString.keyword) {
      const keyword = this.queryString.keyword;
      this.query = this.query.find({
        $or: [
          // بيانات العميل
          { "client.name": { $regex: keyword, $options: "i" } },
          { "client.phone": { $regex: keyword, $options: "i" } },
          { "client.category": { $regex: keyword, $options: "i" } },
          { "client.branch": { $regex: keyword, $options: "i" } },
          { "client.address": { $regex: keyword, $options: "i" } },

          // بيانات العقد (رقم العقد فقط نصي)
          { "contract.number": { $regex: keyword, $options: "i" } },

          // الملاحظات
          { "notes.note1": { $regex: keyword, $options: "i" } },
          { "notes.note2": { $regex: keyword, $options: "i" } },
          { "notes.note3": { $regex: keyword, $options: "i" } },
          { "notes.note4": { $regex: keyword, $options: "i" } },
          { "notes.note5": { $regex: keyword, $options: "i" } },

          // بيانات المصعد
          { "elevator.category": { $regex: keyword, $options: "i" } },
          { "elevator.type": { $regex: keyword, $options: "i" } },
          { "elevator.loadCapacity": { $regex: keyword, $options: "i" } },
          { "elevator.machineType": { $regex: keyword, $options: "i" } },

          // الممثل ومساحة النقل
          { representative: { $regex: keyword, $options: "i" } },
          { transferLocation: { $regex: keyword, $options: "i" } },

          // مواصفات المصعد
          { "specifications.doorType": { $regex: keyword, $options: "i" } },
          { "specifications.doorSize": { $regex: keyword, $options: "i" } },
          { "specifications.innerDoor": { $regex: keyword, $options: "i" } },
          { "specifications.shaftWidth": { $regex: keyword, $options: "i" } },
          { "specifications.shaftLength": { $regex: keyword, $options: "i" } },
          { "specifications.cabinSize": { $regex: keyword, $options: "i" } },
          { "specifications.shaftPit": { $regex: keyword, $options: "i" } },
          {
            "specifications.lastFloorHeight": {
              $regex: keyword,
              $options: "i",
            },
          },

          // يمكن تضيف اسماء مراحل التنفيذ أو وصفها
          { "executionStages.name": { $regex: keyword, $options: "i" } },
          { "executionStages.description": { $regex: keyword, $options: "i" } },
          { "executionStages.notes": { $regex: keyword, $options: "i" } },
        ],
      });
    }
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      // مثلاً: sort=price,-createdAt
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      // ترتيب افتراضي (الأحدث أولاً)
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  paginate() {
    const page = parseInt(this.queryString.page, 10) || 1;
    const limit = parseInt(this.queryString.limit, 10) || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = ApiFetcher;
