const Book = require("../models/Book");
const Order = require("../models/Order");

//-------------------Rent Book-----------------------//
const rentBook = async (req, res, next) => {
    try {
        const bookId = req.params.bookId;
        const book = await Book.findById(bookId);

        if (!book) {
            return res.status(404).json({
                status: 404,
                message: "Book not found!"
            });
        }

        if (book.availableCopies <= 0) {
            return res.status(400).json({
                status: 400,
                message: "No copies available now!"
            });
        }

        const alreadyRented = await Order.findOne({
            user: req.user.id,
            book: bookId,
            status: "rented",
        });

        if (alreadyRented) {
            return res.status(400).json({
                status: 400,
                message: "You already rented this book"
            });
        }

        await Book.findByIdAndUpdate(bookId, {
            $inc: { availableCopies: -1 },
        });

        const order = await Order.create({
            user: req.user.id,
            book: bookId
        });

        res.status(201).json({
            status: 201,
            message: "Book rented successfully",
            data: order
        });
    } catch (err) {
        next(err);
    }
};

//-------------------Return Book---------------------//
const returnBook = async (req, res, next) => {
    try {
        const orderId = req.params.orderId;
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                status: 404,
                message: "Order not found!"
            });
        }

        if (order.user.toString() !== req.user.id) {
            return res.status(403).json({
                status: 403,
                message: "Not allowed to return this order!",
            });
        }

        if (order.status === "returned") {
            return res.status(400).json({
                status: 400,
                message: "Book already returned!"
            });
        }

        const book = await Book.findById(order.book);

        if (!book) {
            return res.status(404).json({
                status: 404,
                message: "Book not found",
            });
        }

        await Book.findByIdAndUpdate(order.book, {
            $inc: { availableCopies: +1 },
        });

        order.status = "returned";
        order.returnedAt = Date.now();

        await order.save();

        res.status(200).json({
            status: 200,
            message: "Book returned successfully"
        });
    } catch (err) {
        next(err);
    }
};

//------------------Get User Rentals-----------------//
const getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({
            user: req.user.id
        })
            .populate("book", "title author availableCopies")
            .sort({ createdAt: -1 });

        res.status(201).json({
            status: 201,
            message: "Get user order successfully",
            data: orders
        });
    } catch (err) {
        next(err);
    }
};

//--------------Get All Rentals(Admin)---------------//
const getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.find()
            .populate("user", "name email role")
            .populate("book", "title author")
            .sort({ createdAt: -1 });

        res.status(201).json({
            status: 201,
            message: "Get All Orders successfully",
            data: orders
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
  rentBook,
  returnBook,
  getMyOrders,
  getAllOrders,
};
