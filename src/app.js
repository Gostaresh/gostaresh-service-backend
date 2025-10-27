"use strict";

require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const routes = require("@/routes");
const { notFound, errorHandler } = require("@/middlewares/error");

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));

// Static uploads for serving product images
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get(["/health", "/"], (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

// Attach body parsers only for API routes
app.use("/api/v1", express.json());
app.use("/api/v1", express.urlencoded({ extended: true }));
app.use("/api/v1", routes);

// 404 and error handlers
app.use(notFound);
app.use(errorHandler);

module.exports = app;
