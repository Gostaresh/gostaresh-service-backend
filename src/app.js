"use strict";

require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { assignReqId, requestLogger } = require("@/middlewares/request_logger");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("@/docs/swagger");

const routes = require("@/routes");
const publicRoutes = require("@/routes/public.routes");
const { notFound, errorHandler } = require("@/middlewares/error");

const app = express();

app.use(helmet());
const corsOptions = {
  origin: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Authorization", "Content-Type"],
};
app.use(cors(corsOptions));
// Ensure CORS preflight (OPTIONS) handled for all routes
// Express v5 uses path-to-regexp@6; use RegExp instead of bare '*'
app.options(/.*/, cors(corsOptions));
app.use(assignReqId);
// Skip chatty routes from verbose logs
const skipReqLog = (req) =>
  req.path === "/health" ||
  req.path.startsWith("/uploads") ||
  req.path.startsWith("/docs") ||
  req.path.startsWith("/docs.json");
app.use(requestLogger({ skip: skipReqLog }));
app.use(morgan("dev"));

// Static uploads for serving product images
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get(["/health", "/"], (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

// Swagger UI and JSON
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, { explorer: true })
);
app.get("/docs.json", (req, res) => res.json(swaggerSpec));

// Public content by slug (no auth, no prefix)
app.use(publicRoutes);

// Attach body parsers only for API routes
app.use("/api/v1", express.json());
app.use("/api/v1", express.urlencoded({ extended: true }));
app.use("/api/v1", routes);

// 404 and error handlers
app.use(notFound);
app.use(errorHandler);

module.exports = app;
