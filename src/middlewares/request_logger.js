"use strict";

const crypto = require("crypto");

const DEFAULT_MAX_STRING = parseInt(process.env.LOG_MAX_STRING || "500", 10);
const DEFAULT_MAX_ARRAY = parseInt(process.env.LOG_MAX_ARRAY || "50", 10);
const ENABLE_BODY = (process.env.LOG_REQUEST_BODY || "true").toLowerCase() !== "false";
const ENABLE_HEADERS = (process.env.LOG_REQUEST_HEADERS || "false").toLowerCase() === "true";

const SENSITIVE_KEYS = new Set(["password", "pass", "authorization", "token", "accessToken", "refreshToken", "secret", "client_secret"]);

function maskValue(key, val) {
  if (val == null) return val;
  if (SENSITIVE_KEYS.has(String(key || "").toLowerCase())) return "***";
  if (typeof val === "string") {
    if (val.length > DEFAULT_MAX_STRING) return val.slice(0, DEFAULT_MAX_STRING) + `...(+${val.length - DEFAULT_MAX_STRING})`;
    return val;
  }
  return val;
}

function sanitize(obj, depth = 0) {
  if (obj == null) return obj;
  if (depth > 3) return "[MaxDepth]";
  if (Array.isArray(obj)) {
    const lim = Math.min(obj.length, DEFAULT_MAX_ARRAY);
    return obj.slice(0, lim).map((v) => sanitize(v, depth + 1)).concat(obj.length > lim ? ["...+" + (obj.length - lim)] : []);
  }
  if (typeof obj === "object") {
    const out = {};
    for (const k of Object.keys(obj)) {
      out[k] = sanitize(maskValue(k, obj[k]), depth + 1);
    }
    return out;
  }
  return obj;
}

function assignReqId(req, _res, next) {
  req.id = req.id || crypto.randomUUID();
  next();
}

function requestLogger(options = {}) {
  const skip = options.skip || ((req) => false);
  const logBody = typeof options.logBody === "boolean" ? options.logBody : ENABLE_BODY;
  const logHeaders = typeof options.logHeaders === "boolean" ? options.logHeaders : ENABLE_HEADERS;
  return (req, res, next) => {
    if (skip(req)) return next();
    const start = process.hrtime.bigint();
    const { method, originalUrl } = req;
    const ip = req.ip || req.connection?.remoteAddress || "";
    const base = `[REQ ${req.id || "-"}] ${method} ${originalUrl}`;
    const parts = [];
    parts.push(`${base} from ${ip}`);
    if (req.auth?.sub) parts.push(`[user:${req.auth.sub}]`);
    if (Object.keys(req.params || {}).length) parts.push(`params=${JSON.stringify(sanitize(req.params))}`);
    if (Object.keys(req.query || {}).length) parts.push(`query=${JSON.stringify(sanitize(req.query))}`);
    if (logBody && req.body && Object.keys(req.body).length) parts.push(`body=${JSON.stringify(sanitize(req.body))}`);
    if (logHeaders) parts.push(`headers=${JSON.stringify(sanitize(req.headers || {}))}`);

    // Log on response finish with status and duration
    res.on("finish", () => {
      const durMs = Number(process.hrtime.bigint() - start) / 1e6;
      // eslint-disable-next-line no-console
      console.log(parts.join(" \n   ") + `\n   -> ${res.statusCode} in ${durMs.toFixed(1)} ms`);
    });
    next();
  };
}

module.exports = {
  assignReqId,
  requestLogger,
};

