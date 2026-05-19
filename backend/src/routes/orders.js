const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrderController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.post('/', OrderController.createOrder);
router.get('/my-orders', OrderController.getMyOrders);
router.get('/:id', OrderController.getOrder);
router.put('/:id/pay', OrderController.updatePayment);
router.put('/:id/cancel', OrderController.cancelOrder);

module.exports = router;
