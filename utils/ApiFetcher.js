// utils/ApiFetcher.js
class ApiFetcher {
  constructor(query, queryString) {
    this.query = query; // Mongoose Query
    this.queryString = queryString; // req.query
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludeFields = ["page", "sort", "limit", "keyword"];
    excludeFields.forEach((field) => delete queryObj[field]);

    // دعم gte و lte وغيره
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt|ne|in|nin)\b/g,
      (match) => `$${match}`
    );

    const filters = JSON.parse(queryStr);

    this.query = this.query.find({
      ...this.query.getQuery(),
      ...filters,
    });

    return this;
  }

  search(fields = []) {
    const keyword = this.queryString.keyword;
    if (keyword && fields.length > 0) {
      const orConditions = fields.map((field) => ({
        [field]: { $regex: keyword, $options: "i" },
      }));

      this.query = this.query.find({
        ...this.query.getQuery(),
        $or: orConditions,
      });
    }

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
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

  getFinalQuery() {
    return this.query;
  }

  getConditionsOnly() {
    return this.query.getQuery();
  }
}

module.exports = ApiFetcher;
