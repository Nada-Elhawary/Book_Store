const Book = require("../models/Book");
const Order = require("../models/Order");

//-------------------Rent Book-----------------------//
const rentBook = async (req, res) => {
  try {
    const bookId = req.params.bookId;
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({
        status: 404,
        message: "Book not found!",
      });
    }

    if (book.availableCopies <= 0) {
      return res.status(400).json({
        status: 400,
        message: "No copies available now!",
      });
    }

    book.availableCopies--;

    await book.save();

    const order = await Order.create({
      user: req.user.id,
      book: bookId,
    });

    res.status(201).json({
      status: 201,
      message: "Order done successfully",
      data: order,
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: err.message,
    });
  }
};

//-------------------Return Book---------------------//
const returnBook = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        status: 404,
        message: "Order not found!",
      });
    }

    if (order.status === "returned") {
      return res.status(400).json({
        status: 400,
        message: "Book already returned!",
      });
    }

    const book = await Book.findById(order.book);

    book.availableCopies++;

    await book.save();

    order.status = "returned";
    order.returnedAt = Date.now();

    await order.save();

    res.status(200).json({
      status: 200,
      message: "Book returned successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: err.message,
    });
  }
};

//------------------Get User Rentals-----------------//
const getMyOrders = async (req, res) => {
  const orders = await Order.find({
    user: req.user.id,
  }).populate("book");

  res.status(201).json({
    status: 201,
    message: "Get user order successfully",
    data: orders,
  });
};

//--------------Get All Rentals(Admin)---------------//
const getAllOrders = async (req, res) => {
  const orders = await Order.find()
    .populate("user", "name email")
    .populate("book", "title author availableCopies");

  res.status(201).json({
    status: 201,
    message: "Get All Orders successfully",
    data: orders,
  });   
};

module.exports = {
  rentBook,
  returnBook,
  getMyOrders,
  getAllOrders,
};
