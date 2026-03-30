const Book = require("../models/Book");

const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json({
      status: 200,
      message: "All Books Received Successfully",
      data: books,
    });
  } catch (err) {
    return res.status(400).json({
      status: 400,
      message: err.message,
      data: null,
    });
  }
};

const getSingleBook = async (req, res) => {
  if (!req.params.id) {
    return res.status(404).json({
      status: 404,
      message: "Must Add Book ID",
      data: null,
    });
  }

  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        status: 404,
        message: "Book Not Found",
        data: null,
      });
    }

    res.status(200).json({
      status: 200,
      message: "Singel Book Recieved Successfuly",
      data: book,
    });
  } catch (err) {
    return res.status(400).json({
      status: 400,
      message: err.message,
      data: null,
    });
  }
};

const addNewBook = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({
      status: 400,
      message: "Must Include Content",
      data: null,
    });
  }
  try {
    const newBook = new Book(req.body);
    await newBook.save();

    res.status(201).json({
      status: 201,
      message: "New Book Created Successfully",
      data: newBook,
    });
  } catch (err) {
    return res.status(400).json({
      status: 400,
      message: err.message,
      data: null,
    });
  }
};

const editBook = async (req, res) => {
  if (!req.params.id) {
    return res.status(404).json({
      status: 404,
      message: "Must Add Book ID",
      data: null,
    });
  }

  try {
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      {
        $set: { ...req.body },
      },
      { returnDocument: "after" },
    );

    if (!updatedBook) {
      return res.status(404).json({
        status: 404,
        message: "Book Not Found",
        data: null,
      });
    }

    res.status(200).json({
      status: 200,
      message: "Book Updated Successfuly",
      data: updatedBook,
    });
  } catch (err) {
    return res.status(400).json({
      status: 400,
      message: err.message,
      data: null,
    });
  }
};

const deleteBook = async (req, res) => {
  if (!req.params.id) {
    return res.status(404).json({
      status: 404,
      message: "Must Add Book ID",
      data: null,
    });
  }
  try {
    const deletedBook = await Book.findByIdAndDelete(
      { _id: req.params.id },
      { returnDocument: "after" },
    );

    if (!deletedBook) {
      return res.status(404).json({
        status: 404,
        message: "Book Not Found",
        data: null,
      });
    }

    res.status(200).json({
      status: 200,
      message: "Book Deleted Successfuly",
      data: deletedBook,
    });
  } catch (err) {
    return res.status(400).json({
      status: 400,
      message: err.message,
      data: null,
    });
  }
};

module.exports = {
  getAllBooks,
  getSingleBook,
  addNewBook,
  editBook,
  deleteBook,
};
