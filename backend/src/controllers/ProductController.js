const { ProductRepository } = require('../repositories');
const { ApiResponse } = require('../utils/ApiResponse');

class ProductController {
  async getProducts(req, res) {
    try {
      const {
        search = '',
        category,
        minPrice,
        maxPrice,
        sort = 'newest',
        page = 1,
        limit = 12,
        brand,
        rating,
      } = req.query;

      const filters = { isActive: true };
      if (category) filters.category = category;
      if (brand) filters.brand = { $regex: brand, $options: 'i' };
      if (minPrice || maxPrice) {
        filters.price = {};
        if (minPrice) filters.price.$gte = Number(minPrice);
        if (maxPrice) filters.price.$lte = Number(maxPrice);
      }
      if (rating) filters.rating = { $gte: Number(rating) };

      let sortObj = {};
      switch (sort) {
        case 'price-asc': sortObj = { price: 1 }; break;
        case 'price-desc': sortObj = { price: -1 }; break;
        case 'rating': sortObj = { rating: -1 }; break;
        case 'popular': sortObj = { numReviews: -1 }; break;
        default: sortObj = { createdAt: -1 };
      }

      const result = await ProductRepository.search(search, filters, {
        page: Number(page),
        limit: Number(limit),
        sort: sortObj,
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

  async getProduct(req, res) {
    try {
      const product = await ProductRepository.findById(req.params.id);
      if (!product) return ApiResponse.error(res, 'Product not found', 404);
      return ApiResponse.success(res, { product });
    } catch (error) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  async getFeaturedProducts(req, res) {
    try {
      const products = await ProductRepository.getFeatured(8);
      return ApiResponse.success(res, { products });
    } catch (error) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  async getCategories(req, res) {
    try {
      const categories = ['Electronics', 'Fashion', 'Home & Living', 'Sports', 'Books', 'Beauty', 'Toys', 'Food', 'Automotive', 'Other'];
      return ApiResponse.success(res, { categories });
    } catch (error) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  async addReview(req, res) {
    try {
      const { rating, comment } = req.body;
      const product = await ProductRepository.findById(req.params.id);
      if (!product) return ApiResponse.error(res, 'Product not found', 404);

      const alreadyReviewed = product.reviews.find(
        r => r.user.toString() === req.user._id.toString()
      );
      if (alreadyReviewed) {
        return ApiResponse.error(res, 'Product already reviewed', 400);
      }

      const updatedProduct = await ProductRepository.addReview(req.params.id, {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
      });

      return ApiResponse.success(res, { product: updatedProduct }, 'Review added successfully', 201);
    } catch (error) {
      return ApiResponse.error(res, error.message, 500);
    }
  }
}

module.exports = new ProductController();
