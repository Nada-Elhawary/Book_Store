const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
  status: {
    type: String,
    enum: ["rented", "returned"],
    default: "rented",
  },
  rentedAt: {
    type: Date,
    default: Date.now,
  },
  returnedAt: {
    type: Date,
  },
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);