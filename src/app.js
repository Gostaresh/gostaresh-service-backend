'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const routes = require('./routes');
const { notFound, errorHandler } = require('./middlewares/error');
const { setupAdmin } = require('./admin');

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// Attach body parsers only for API routes (avoid interfering with AdminJS)
app.use('/api/v1', express.json());
app.use('/api/v1', express.urlencoded({ extended: true }));
app.use('/api/v1', routes);
// AdminJS panel (mounted asynchronously). Register 404/error after mounting.
const adminReady = setupAdmin(app)
  .catch((err) => {
    console.error('AdminJS setup failed:', err);
  })
  .finally(() => {
    app.use(notFound);
    app.use(errorHandler);
  });

module.exports = app;
module.exports.ready = adminReady;
