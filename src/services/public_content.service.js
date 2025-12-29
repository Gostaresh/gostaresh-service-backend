"use strict";

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "public-data");

let allowedKeys = new Set();
try {
  allowedKeys = new Set(
    fs
      .readdirSync(DATA_DIR, { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
      .map((entry) => path.basename(entry.name, ".json"))
  );
} catch {
  allowedKeys = new Set();
}

const cache = new Map();

function normalizeKey(raw) {
  return String(raw || "")
    .trim()
    .replace(/\.json$/i, "");
}

function listKeys() {
  return Array.from(allowedKeys.values());
}

function loadJsonForKey(key) {
  const normalized = normalizeKey(key);
  if (!allowedKeys.has(normalized)) return null;

  const filePath = path.join(DATA_DIR, `${normalized}.json`);
  try {
    const stat = fs.statSync(filePath);
    const cached = cache.get(normalized);
    if (cached && cached.mtimeMs === stat.mtimeMs) {
      return cached.data;
    }
    const raw = fs.readFileSync(filePath, "utf8");
    const parsed = JSON.parse(raw);
    cache.set(normalized, { mtimeMs: stat.mtimeMs, data: parsed });
    return parsed;
  } catch {
    return null;
  }
}

module.exports = {
  listKeys,
  loadJsonForKey,
  normalizeKey,
};
