const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/AdminController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect, adminOnly);

router.get('/dashboard', AdminController.getDashboardStats);

// Products
router.get('/products', AdminController.getAllProducts);
router.post('/products', AdminController.createProduct);
router.put('/products/:id', AdminController.updateProduct);
router.delete('/products/:id', AdminController.deleteProduct);

// Orders
router.get('/orders', AdminController.getAllOrders);
router.put('/orders/:id/status', AdminController.updateOrderStatus);

// Users
router.get('/users', AdminController.getAllUsers);
router.put('/users/:id/toggle', AdminController.toggleUserStatus);

// Coupons
router.get('/coupons', AdminController.getCoupons);
router.post('/coupons', AdminController.createCoupon);
router.delete('/coupons/:id', AdminController.deleteCoupon);

module.exports = router;
