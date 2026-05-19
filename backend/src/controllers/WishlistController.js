const { UserRepository } = require('../repositories');
const { ApiResponse } = require('../utils/ApiResponse');

class WishlistController {
  async getWishlist(req, res) {
    try {
      const user = await UserRepository.findById(req.user._id, 'wishlist');
      return ApiResponse.success(res, { wishlist: user.wishlist });
    } catch (error) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  async addToWishlist(req, res) {
    try {
      const { productId } = req.body;
      const user = await UserRepository.addToWishlist(req.user._id, productId);
      return ApiResponse.success(res, { wishlist: user.wishlist }, 'Added to wishlist');
    } catch (error) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  async removeFromWishlist(req, res) {
    try {
      const { productId } = req.params;
      const user = await UserRepository.removeFromWishlist(req.user._id, productId);
      return ApiResponse.success(res, { wishlist: user.wishlist }, 'Removed from wishlist');
    } catch (error) {
      return ApiResponse.error(res, error.message, 500);
    }
  }
}

module.exports = new WishlistController();
