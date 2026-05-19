const { OrderRepository, CartRepository, ProductRepository, CouponRepository } = require('../repositories');
const { ApiResponse } = require('../utils/ApiResponse');

class OrderController {
  async createOrder(req, res) {
    try {
      const { shippingAddress, paymentMethod = 'cod', notes } = req.body;

      const cart = await CartRepository.findByUser(req.user._id);
      if (!cart || cart.items.length === 0) {
        return ApiResponse.error(res, 'Cart is empty', 400);
      }

      // Validate stock
      for (const item of cart.items) {
        const product = await ProductRepository.findById(item.product._id);
        if (!product) return ApiResponse.error(res, `Product not found`, 404);
        if (product.stock < item.quantity) {
          return ApiResponse.error(res, `Insufficient stock for ${product.name}`, 400);
        }
      }

      const itemsPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const shippingPrice = itemsPrice > 500 ? 0 : 49;
      const taxPrice = Math.round(itemsPrice * 0.18);
      const discountPrice = cart.discount || 0;
      const totalPrice = itemsPrice + shippingPrice + taxPrice - discountPrice;

      const orderItems = cart.items.map(item => ({
        product: item.product._id,
        name: item.product.name,
        image: item.product.images?.[0]?.url || '',
        price: item.price,
        quantity: item.quantity
      }));

      const order = await OrderRepository.create({
        user: req.user._id,
        items: orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        discountPrice,
        totalPrice,
        couponCode: cart.couponCode,
        notes,
        isPaid: paymentMethod === 'cod' ? false : false,
        status: 'pending'
      });

      // Deduct stock
      for (const item of cart.items) {
        await ProductRepository.update(item.product._id, {
          $inc: { stock: -item.quantity }
        });
      }

      // Increment coupon usage
      if (cart.couponCode) {
        const coupon = await CouponRepository.findByCode(cart.couponCode);
        if (coupon) await CouponRepository.incrementUsage(coupon._id, req.user._id);
      }

      // Clear cart
      await CartRepository.clearCart(req.user._id);

      return ApiResponse.success(res, { order }, 'Order placed successfully', 201);
    } catch (error) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  async getMyOrders(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const result = await OrderRepository.findByUser(req.user._id, {
        page: Number(page),
        limit: Number(limit)
      });

      return ApiResponse.paginated(res, result.data, {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      });
    } catch (error) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  async getOrder(req, res) {
    try {
      const order = await OrderRepository.findById(req.params.id, 'items.product user');
      if (!order) return ApiResponse.error(res, 'Order not found', 404);

      if (order.user._id?.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return ApiResponse.error(res, 'Not authorized', 403);
      }

      return ApiResponse.success(res, { order });
    } catch (error) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  async updatePayment(req, res) {
    try {
      const { paymentResult } = req.body;
      const order = await OrderRepository.findById(req.params.id);
      if (!order) return ApiResponse.error(res, 'Order not found', 404);

      const updated = await OrderRepository.update(req.params.id, {
        isPaid: true,
        paidAt: new Date(),
        paymentResult,
        status: 'confirmed'
      });

      return ApiResponse.success(res, { order: updated }, 'Payment updated');
    } catch (error) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  async cancelOrder(req, res) {
    try {
      const order = await OrderRepository.findById(req.params.id);
      if (!order) return ApiResponse.error(res, 'Order not found', 404);

      if (order.user.toString() !== req.user._id.toString()) {
        return ApiResponse.error(res, 'Not authorized', 403);
      }

      if (['shipped', 'delivered'].includes(order.status)) {
        return ApiResponse.error(res, 'Cannot cancel order at this stage', 400);
      }

      // Restore stock
      for (const item of order.items) {
        await ProductRepository.update(item.product, { $inc: { stock: item.quantity } });
      }

      const updated = await OrderRepository.update(req.params.id, { status: 'cancelled' });
      return ApiResponse.success(res, { order: updated }, 'Order cancelled');
    } catch (error) {
      return ApiResponse.error(res, error.message, 500);
    }
  }
}

module.exports = new OrderController();
