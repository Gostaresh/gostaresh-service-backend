"use strict";

const { Op } = require("sequelize");
const { toSafeSegment } = require("@/utils/file");

function normalizeBase(text, maxLength = 80) {
  const base = toSafeSegment(String(text || "").toLowerCase());
  const trimmed = base.slice(0, maxLength).replace(/-+$/g, "");
  // fallback when base becomes empty
  return trimmed || "item";
}

async function generateUniqueSlug(Model, sourceText, options = {}) {
  const { idToExclude = null, field = "slug", whereExtra = {}, maxLength = 80 } = options;
  const base = normalizeBase(sourceText, maxLength);

  const where = {
    [field]: { [Op.like]: `${base}%` },
    ...whereExtra,
  };
  if (idToExclude) where.id = { [Op.ne]: idToExclude };

  const existing = await Model.findAll({
    where,
    attributes: [field],
    raw: true,
  });
  const existingSet = new Set(existing.map((r) => r[field]));

  if (!existingSet.has(base)) return base;

  // find next available -2, -3, ... up to a reasonable cap
  for (let i = 2; i < 10000; i++) {
    const candidate = `${base}-${i}`.slice(0, maxLength);
    if (!existingSet.has(candidate)) return candidate;
  }
  // last resort unique fallback
  return `${base}-${Date.now()}`.slice(0, maxLength);
}

module.exports = {
  normalizeBase,
  generateUniqueSlug,
};

