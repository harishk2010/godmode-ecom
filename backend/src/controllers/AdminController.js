const { ProductRepository, UserRepository, OrderRepository, CouponRepository } = require('../repositories');
const { ApiResponse } = require('../utils/ApiResponse');

class AdminController {
  // --- Products ---
  async createProduct(req, res) {
    try {
      const product = await ProductRepository.create(req.body);
      return ApiResponse.success(res, { product }, 'Product created', 201);
    } catch (error) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  async updateProduct(req, res) {
    try {
      const product = await ProductRepository.update(req.params.id, req.body);
      if (!product) return ApiResponse.error(res, 'Product not found', 404);
      return ApiResponse.success(res, { product }, 'Product updated');
    } catch (error) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  async deleteProduct(req, res) {
    try {
      const product = await ProductRepository.update(req.params.id, { isActive: false });
      if (!product) return ApiResponse.error(res, 'Product not found', 404);
      return ApiResponse.success(res, {}, 'Product deleted');
    } catch (error) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  async getAllProducts(req, res) {
    try {
      const { page = 1, limit = 20, search = '' } = req.query;
      const filter = search ? { name: { $regex: search, $options: 'i' } } : {};
      const result = await ProductRepository.findAll(filter, { page: Number(page), limit: Number(limit) });
      return ApiResponse.paginated(res, result.data, {
        total: result.total, page: result.page, limit: result.limit, totalPages: result.totalPages
      });
    } catch (error) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  // --- Orders ---
  async getAllOrders(req, res) {
    try {
      const { page = 1, limit = 20, status } = req.query;
      const filter = status ? { status } : {};
      const result = await OrderRepository.findAll(filter, {
        page: Number(page), limit: Number(limit), populate: 'user'
      });
      return ApiResponse.paginated(res, result.data, {
        total: result.total, page: result.page, limit: result.limit, totalPages: result.totalPages
      });
    } catch (error) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  async updateOrderStatus(req, res) {
    try {
      const { status, trackingNumber } = req.body;
      const update = { status };
      if (trackingNumber) update.trackingNumber = trackingNumber;
      if (status === 'delivered') { update.isDelivered = true; update.deliveredAt = new Date(); }

      const order = await OrderRepository.update(req.params.id, update);
      if (!order) return ApiResponse.error(res, 'Order not found', 404);
      return ApiResponse.success(res, { order }, 'Order status updated');
    } catch (error) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  // --- Users ---
  async getAllUsers(req, res) {
    try {
      const { page = 1, limit = 20 } = req.query;
      const result = await UserRepository.findAll({}, { page: Number(page), limit: Number(limit) });
      return ApiResponse.paginated(res, result.data, {
        total: result.total, page: result.page, limit: result.limit, totalPages: result.totalPages
      });
    } catch (error) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  async toggleUserStatus(req, res) {
    try {
      const user = await UserRepository.findById(req.params.id);
      if (!user) return ApiResponse.error(res, 'User not found', 404);
      const updated = await UserRepository.update(req.params.id, { isActive: !user.isActive });
      return ApiResponse.success(res, { user: updated }, 'User status updated');
    } catch (error) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  // --- Coupons ---
  async createCoupon(req, res) {
    try {
      const coupon = await CouponRepository.create(req.body);
      return ApiResponse.success(res, { coupon }, 'Coupon created', 201);
    } catch (error) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  async getCoupons(req, res) {
    try {
      const result = await CouponRepository.findAll({}, { limit: 50 });
      return ApiResponse.success(res, { coupons: result.data });
    } catch (error) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  async deleteCoupon(req, res) {
    try {
      await CouponRepository.delete(req.params.id);
      return ApiResponse.success(res, {}, 'Coupon deleted');
    } catch (error) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  // --- Dashboard ---
  async getDashboardStats(req, res) {
    try {
      const [totalUsers, totalProducts, totalOrders, revenueData] = await Promise.all([
        UserRepository.count({ role: 'user' }),
        ProductRepository.count({ isActive: true }),
        OrderRepository.count({}),
        OrderRepository.aggregate([
          { $match: { status: { $ne: 'cancelled' } } },
          { $group: { _id: null, total: { $sum: '$totalPrice' } } }
        ])
      ]);

      const recentOrders = await OrderRepository.findAll({}, { limit: 5, populate: 'user' });
      const totalRevenue = revenueData[0]?.total || 0;

      return ApiResponse.success(res, {
        stats: { totalUsers, totalProducts, totalOrders, totalRevenue },
        recentOrders: recentOrders.data
      });
    } catch (error) {
      return ApiResponse.error(res, error.message, 500);
    }
  }
}

module.exports = new AdminController();
