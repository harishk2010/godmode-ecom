const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');
const { protect } = require('../middleware/auth');

router.get('/', ProductController.getProducts);
router.get('/featured', ProductController.getFeaturedProducts);
router.get('/categories', ProductController.getCategories);
router.get('/:id', ProductController.getProduct);
router.post('/:id/reviews', protect, ProductController.addReview);

module.exports = router;
