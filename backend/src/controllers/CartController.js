const { CartRepository, ProductRepository, CouponRepository } = require('../repositories');
const { ApiResponse } = require('../utils/ApiResponse');

class CartController {
  async getCart(req, res) {
    try {
      let cart = await CartRepository.findByUser(req.user._id);
      if (!cart) {
        cart = await CartRepository.create({ user: req.user._id, items: [] });
      }
      return ApiResponse.success(res, { cart });
    } catch (error) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  async addToCart(req, res) {
    try {
      const { productId, quantity = 1 } = req.body;

      const product = await ProductRepository.findById(productId);
      if (!product) return ApiResponse.error(res, 'Product not found', 404);
      if (product.stock < quantity) return ApiResponse.error(res, 'Insufficient stock', 400);

      let cart = await CartRepository.findByUser(req.user._id);
      if (!cart) cart = { user: req.user._id, items: [] };

      const items = cart.items || [];
      const existingIndex = items.findIndex(
        item => item.product._id?.toString() === productId || item.product?.toString() === productId
      );

      const price = product.discount > 0
        ? product.price - (product.price * product.discount / 100)
        : product.price;

      if (existingIndex >= 0) {
        const newQty = items[existingIndex].quantity + Number(quantity);
        if (newQty > product.stock) return ApiResponse.error(res, 'Insufficient stock', 400);
        items[existingIndex].quantity = newQty;
        items[existingIndex].price = price;
      } else {
        items.push({ product: productId, quantity: Number(quantity), price });
      }

      const updatedCart = await CartRepository.upsertCart(req.user._id, {
        user: req.user._id,
        items
      });

      return ApiResponse.success(res, { cart: updatedCart }, 'Item added to cart');
    } catch (error) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  async updateCartItem(req, res) {
    try {
      const { productId, quantity } = req.body;

      const product = await ProductRepository.findById(productId);
      if (!product) return ApiResponse.error(res, 'Product not found', 404);
      if (quantity > product.stock) return ApiResponse.error(res, 'Insufficient stock', 400);

      const cart = await CartRepository.findByUser(req.user._id);
      if (!cart) return ApiResponse.error(res, 'Cart not found', 404);

      const itemIndex = cart.items.findIndex(
        item => item.product._id?.toString() === productId
      );

      if (itemIndex < 0) return ApiResponse.error(res, 'Item not in cart', 404);

      if (quantity <= 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = Number(quantity);
      }

      const updatedCart = await CartRepository.upsertCart(req.user._id, {
        items: cart.items,
        couponCode: cart.couponCode,
        discount: cart.discount
      });

      return ApiResponse.success(res, { cart: updatedCart }, 'Cart updated');
    } catch (error) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  async removeFromCart(req, res) {
    try {
      const { productId } = req.params;
      const cart = await CartRepository.findByUser(req.user._id);
      if (!cart) return ApiResponse.error(res, 'Cart not found', 404);

      cart.items = cart.items.filter(
        item => item.product._id?.toString() !== productId
      );

      const updatedCart = await CartRepository.upsertCart(req.user._id, {
        items: cart.items,
        couponCode: cart.couponCode,
        discount: cart.discount
      });

      return ApiResponse.success(res, { cart: updatedCart }, 'Item removed from cart');
    } catch (error) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  async clearCart(req, res) {
    try {
      const cart = await CartRepository.clearCart(req.user._id);
      return ApiResponse.success(res, { cart }, 'Cart cleared');
    } catch (error) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  async applyCoupon(req, res) {
    try {
      const { code } = req.body;
      const coupon = await CouponRepository.findByCode(code);

      if (!coupon) return ApiResponse.error(res, 'Invalid coupon code', 400);
      if (coupon.expiresAt && new Date() > coupon.expiresAt) return ApiResponse.error(res, 'Coupon expired', 400);
      if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return ApiResponse.error(res, 'Coupon usage limit reached', 400);
      if (coupon.usedBy.includes(req.user._id)) return ApiResponse.error(res, 'Coupon already used by you', 400);

      const cart = await CartRepository.findByUser(req.user._id);
      if (!cart) return ApiResponse.error(res, 'Cart not found', 404);

      const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      if (subtotal < coupon.minOrderAmount) {
        return ApiResponse.error(res, `Minimum order amount is ₹${coupon.minOrderAmount}`, 400);
      }

      let discount = 0;
      if (coupon.type === 'percentage') {
        discount = (subtotal * coupon.value) / 100;
        if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
      } else {
        discount = Math.min(coupon.value, subtotal);
      }

      const updatedCart = await CartRepository.upsertCart(req.user._id, {
        items: cart.items,
        couponCode: coupon.code,
        discount
      });

      return ApiResponse.success(res, { cart: updatedCart, discount, coupon: coupon.code }, 'Coupon applied successfully');
    } catch (error) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  async removeCoupon(req, res) {
    try {
      const cart = await CartRepository.findByUser(req.user._id);
      if (!cart) return ApiResponse.error(res, 'Cart not found', 404);

      const updatedCart = await CartRepository.upsertCart(req.user._id, {
        items: cart.items,
        couponCode: null,
        discount: 0
      });

      return ApiResponse.success(res, { cart: updatedCart }, 'Coupon removed');
    } catch (error) {
      return ApiResponse.error(res, error.message, 500);
    }
  }
}

module.exports = new CartController();
