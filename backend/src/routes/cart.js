const express = require('express');
const router = express.Router();
const CartController = require('../controllers/CartController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/', CartController.getCart);
router.post('/add', CartController.addToCart);
router.put('/update', CartController.updateCartItem);
router.delete('/item/:productId', CartController.removeFromCart);
router.delete('/clear', CartController.clearCart);
router.post('/coupon', CartController.applyCoupon);
router.delete('/coupon', CartController.removeCoupon);

module.exports = router;
