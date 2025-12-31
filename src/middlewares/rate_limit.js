"use strict";

function toInt(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function createRateLimiter(options = {}) {
  const windowMs = toInt(options.windowMs, 60 * 1000);
  const max = toInt(options.max, 60);
  const message = options.message || "Too many requests, please try again later.";
  const keyGenerator = options.keyGenerator;
  const store = new Map();
  let lastCleanup = 0;

  function cleanup(now) {
    if (now - lastCleanup < windowMs) return;
    lastCleanup = now;
    for (const [key, entry] of store.entries()) {
      if (!entry || entry.resetAt <= now) store.delete(key);
    }
  }

  return (req, res, next) => {
    const now = Date.now();
    cleanup(now);

    const key =
      (typeof keyGenerator === "function" ? keyGenerator(req) : null) ||
      req.ip ||
      "global";

    let entry = store.get(key);
    if (!entry || entry.resetAt <= now) {
      entry = { count: 0, resetAt: now + windowMs };
      store.set(key, entry);
    }

    entry.count += 1;
    const remaining = Math.max(0, max - entry.count);
    res.setHeader("X-RateLimit-Limit", String(max));
    res.setHeader("X-RateLimit-Remaining", String(remaining));
    res.setHeader("X-RateLimit-Reset", String(Math.ceil(entry.resetAt / 1000)));

    if (entry.count > max) {
      res.setHeader(
        "Retry-After",
        String(Math.max(1, Math.ceil((entry.resetAt - now) / 1000)))
      );
      return res.status(429).json({ message });
    }

    next();
  };
}

module.exports = { createRateLimiter };
