const GenericRepository = require('./GenericRepository');
const User = require('../models/User');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Coupon = require('../models/Coupon');

class UserRepository extends GenericRepository {
  constructor() {
    super(User);
  }

  async findByEmail(email) {
    return this.model.findOne({ email }).select('+password').exec();
  }

  async findByEmailWithoutPassword(email) {
    return this.model.findOne({ email }).exec();
  }

  async addToWishlist(userId, productId) {
    return this.model.findByIdAndUpdate(
      userId,
      { $addToSet: { wishlist: productId } },
      { new: true }
    ).populate('wishlist').exec();
  }

  async removeFromWishlist(userId, productId) {
    return this.model.findByIdAndUpdate(
      userId,
      { $pull: { wishlist: productId } },
      { new: true }
    ).populate('wishlist').exec();
  }
}

class ProductRepository extends GenericRepository {
  constructor() {
    super(Product);
  }

  async search(query, filters = {}, options = {}) {
    const {
      page = 1,
      limit = 12,
      sort = { createdAt: -1 },
    } = options;

    const filter = { isActive: true, ...filters };

    if (query) {
      filter.$text = { $search: query };
    }

    const skip = (page - 1) * limit;

    let sortObj = sort;
    if (query) {
      sortObj = { score: { $meta: 'textScore' }, ...sort };
    }

    const mongoQuery = this.model.find(filter);
    if (query) mongoQuery.select({ score: { $meta: 'textScore' } });
    mongoQuery.sort(sortObj).skip(skip).limit(limit);

    const [data, total] = await Promise.all([
      mongoQuery.exec(),
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

  async findBySlug(slug) {
    return this.model.findOne({ slug, isActive: true }).exec();
  }

  async getFeatured(limit = 8) {
    return this.model.find({ isFeatured: true, isActive: true }).limit(limit).exec();
  }

  async getByCategory(category, options = {}) {
    return this.findAll({ category, isActive: true }, options);
  }

  async addReview(productId, review) {
    const product = await this.findById(productId);
    if (!product) throw new Error('Product not found');
    product.reviews.push(review);
    product.calculateRating();
    return product.save();
  }
}

class CartRepository extends GenericRepository {
  constructor() {
    super(Cart);
  }

  async findByUser(userId) {
    return this.model.findOne({ user: userId })
      .populate('items.product', 'name images price stock discount discountedPrice')
      .exec();
  }

  async upsertCart(userId, cartData) {
    return this.model.findOneAndUpdate(
      { user: userId },
      cartData,
      { new: true, upsert: true, runValidators: true }
    ).populate('items.product', 'name images price stock discount discountedPrice').exec();
  }

  async clearCart(userId) {
    return this.model.findOneAndUpdate(
      { user: userId },
      { items: [], couponCode: null, discount: 0 },
      { new: true }
    ).exec();
  }
}

class OrderRepository extends GenericRepository {
  constructor() {
    super(Order);
  }

  async findByUser(userId, options = {}) {
    return this.findAll({ user: userId }, {
      ...options,
      populate: 'items.product'
    });
  }

  async findByOrderNumber(orderNumber) {
    return this.model.findOne({ orderNumber })
      .populate('user', 'name email')
      .populate('items.product')
      .exec();
  }

  async getAdminOrders(options = {}) {
    return this.findAll({}, {
      ...options,
      populate: 'user'
    });
  }
}

class CouponRepository extends GenericRepository {
  constructor() {
    super(Coupon);
  }

  async findByCode(code) {
    return this.model.findOne({ code: code.toUpperCase(), isActive: true }).exec();
  }

  async incrementUsage(couponId, userId) {
    return this.model.findByIdAndUpdate(couponId, {
      $inc: { usedCount: 1 },
      $addToSet: { usedBy: userId }
    }, { new: true }).exec();
  }
}

module.exports = {
  UserRepository: new UserRepository(),
  ProductRepository: new ProductRepository(),
  CartRepository: new CartRepository(),
  OrderRepository: new OrderRepository(),
  CouponRepository: new CouponRepository(),
};
