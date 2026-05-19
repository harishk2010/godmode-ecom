const IRepository = require('../interfaces/IRepository');

/**
 * GenericRepository - Base repository with common CRUD operations
 * All specific repositories extend this class
 */
class GenericRepository extends IRepository {
  constructor(model) {
    super();
    this.model = model;
  }

  async findById(id, populate = '') {
    return this.model.findById(id).populate(populate).exec();
  }

  async findOne(filter, populate = '') {
    return this.model.findOne(filter).populate(populate).exec();
  }

  async findAll(filter = {}, options = {}) {
    const {
      sort = { createdAt: -1 },
      page = 1,
      limit = 10,
      populate = '',
      select = '',
    } = options;

    const skip = (page - 1) * limit;

    const query = this.model.find(filter);

    if (select) query.select(select);
    if (populate) query.populate(populate);
    query.sort(sort).skip(skip).limit(limit);

    const [data, total] = await Promise.all([
      query.exec(),
      this.model.countDocuments(filter)
    ]);

    return {
      data,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    };
  }

  async create(data) {
    const document = new this.model(data);
    return document.save();
  }

  async update(id, data, options = { new: true, runValidators: true }) {
    return this.model.findByIdAndUpdate(id, data, options).exec();
  }

  async updateOne(filter, data, options = { new: true }) {
    return this.model.findOneAndUpdate(filter, data, options).exec();
  }

  async delete(id) {
    return this.model.findByIdAndDelete(id).exec();
  }

  async deleteOne(filter) {
    return this.model.findOneAndDelete(filter).exec();
  }

  async count(filter = {}) {
    return this.model.countDocuments(filter);
  }

  async exists(filter) {
    return this.model.exists(filter);
  }

  async aggregate(pipeline) {
    return this.model.aggregate(pipeline).exec();
  }

  async bulkCreate(dataArray) {
    return this.model.insertMany(dataArray);
  }
}

module.exports = GenericRepository;
