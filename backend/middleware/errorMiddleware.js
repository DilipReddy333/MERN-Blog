const errorMiddleware = (err, req, res, next) => {
  const code = err.statusCode || 500;
  res.status(code).json({ message: err.message });
  next();
};

module.exports = errorMiddleware;
