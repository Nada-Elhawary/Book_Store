const express = require("express");
const order = require("../controllers/orderController");
const { authMiddleware, requireAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/rent/:bookId", authMiddleware, order.rentBook);

router.put("/return/:orderId", authMiddleware, order.returnBook);

router.get("/my-orders", authMiddleware, order.getMyOrders);

router.get("/", authMiddleware, requireAdmin, order.getAllOrders);

module.exports = router;