const errorHandler = (err, req, res, next) => {
  console.error(err);
  const statusCode =
    err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);

  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
  });
};

module.exports = { errorHandler };