const express = require('express');
const router = express.Router();
const WishlistController = require('../controllers/WishlistController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/', WishlistController.getWishlist);
router.post('/', WishlistController.addToWishlist);
router.delete('/:productId', WishlistController.removeFromWishlist);

module.exports = router;
