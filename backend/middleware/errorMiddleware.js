const handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg)
    res.status(err.status).send({ message: err.message });
  else next(err);
};

const errorHandler = (error, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;

  res.status(statusCode);
  res.send({
    message: error.message,
    stack: process.env.NODE_ENV === "production" ? null : error.stack,
  });
};

module.exports = { errorHandler, handleCustomErrors };
