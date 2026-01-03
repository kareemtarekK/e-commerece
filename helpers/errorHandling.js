exports.errorHandling = (err, req, res, next) => {
  err.statusCode = err.status || 500;
  if (err.name === "UnauthorizedError")
    res.status(err.statusCode).json({
      status: "fail",
      message: err.message,
    });
};
