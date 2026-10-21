const errorHandler = (err, _req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  console.error(err);

  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return res.status(400).json({ error: err.message });
  }
  if (err.code === 11000) {
    return res.status(409).json({ error: 'An account with that email already exists' });
  }
  return res.status(err.statusCode || 500).json({
    error: err.statusCode ? err.message : 'An unexpected server error occurred'
  });
};

module.exports = errorHandler;
