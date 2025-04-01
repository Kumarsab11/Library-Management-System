import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import Errorhandler from "../middlewares/errorMiddlewares.js";
import { Borrow } from "../models/borrowModel.js";
import { Book } from "../models/bookModel.js";
import { User } from "../models/userModel.js";

export const recordBorrowedBook = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { email } = req.body;

  const book = await Book.findById(id);
  if (!book) {
    return next(new Errorhandler("Book not found", 404));
  }
  const user = await User.findOne({ email });
  if (!user) {
    return next(new Errorhandler("User not found", 404));
  }
  if (book.quantity === 0) {
    return next(new Errorhandler("Book not available", 404));
  }
  const isAlreadyBorrowed = user.borrowedBooks.find(
    (b) => b.bookId.toString() == id && b.returned === false
  );
  if (isAlreadyBorrowed) {
    return next(new Errorhandler("Book already borrowed", 400));
  }
  book.quantity -= 1;
  book.availability = book.quantity > 0;
  await book.save();

  user.borrowedBooks.push({
    bookId: book._id,
    bookTitle: book.title,
    borrowedDate: new Date(),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
  await user.save();
  await Borrow.create({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    book: book._id,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    price: book.price,
  });
  res.status(200).json({
    success: true,
    message: "Book borrowed successfully",
  });
});

export const borrowedBooks = catchAsyncErrors(
  async (req, resizeBy, next) => {}
);

export const getBorrowedBooksForAdmin = catchAsyncErrors(
  async (req, res, next) => {}
);

export const returnBorrowBook = catchAsyncErrors(async (req, res, next) => {});
