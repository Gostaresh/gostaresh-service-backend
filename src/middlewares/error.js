'use strict';

exports.notFound = (req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
};

exports.errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  if (status >= 500) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
  res.status(status).json({ message });
};

