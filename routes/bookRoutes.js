const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
const {
  authMiddleware,
  requireAdmin,
} = require("../middleware/authMiddleware");

router
  .route("/")
  .get(bookController.getAllBooks)
  .post(authMiddleware, requireAdmin, bookController.addNewBook);

router
  .route("/:id")
  .get(bookController.getSingleBook)
  .patch(authMiddleware, requireAdmin, bookController.editBook)
  .delete(authMiddleware, requireAdmin, bookController.deleteBook);

module.exports = router;
