const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop",
  },
  availableCopies: {
    type: Number,
    default: 1,
  },
}, { timestamps: true });

module.exports = mongoose.model("Book", bookSchema);