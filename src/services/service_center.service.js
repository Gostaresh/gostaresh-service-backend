"use strict";

const { Op } = require("sequelize");
const { service_center, service_center_contact, service: serviceModel } = require("@/models");
const { generateUniqueSlug } = require("@/utils/slug");

const defaultInclude = [
  { model: service_center_contact, as: "contacts" },
  { model: serviceModel, as: "services", through: { attributes: [] } },
];

function normalizeServiceValues(input) {
  if (!Array.isArray(input)) return [];
  const seen = new Set();
  const values = [];
  for (const raw of input) {
    const value = String(raw || "").trim();
    if (!value || seen.has(value)) continue;
    seen.add(value);
    values.push(value);
  }
  return values;
}

function normalizeContacts(input) {
  if (!Array.isArray(input)) return [];
  const rows = [];
  for (const item of input) {
    if (!item || typeof item !== "object") continue;
    const title = String(item.title || "").trim();
    const value = String(item.value ?? "").trim();
    if (!title) continue;
    rows.push({ title, value });
  }
  return rows;
}

async function syncContacts(serviceCenterID, contacts, transaction) {
  if (typeof contacts === "undefined") return;
  const rows = normalizeContacts(contacts);
  await service_center_contact.destroy({ where: { serviceCenterID }, transaction });
  if (rows.length === 0) return;
  await service_center_contact.bulkCreate(
    rows.map((row) => ({ ...row, serviceCenterID })),
    { transaction }
  );
}

async function syncServices(center, services, transaction) {
  if (typeof services === "undefined") return;
  if (!center) return;
  const values = normalizeServiceValues(services);
  if (values.length === 0) {
    await center.setServices([], { transaction });
    return;
  }
  const existing = await serviceModel.findAll({
    where: { value: { [Op.in]: values } },
    transaction,
  });
  const existingSet = new Set(existing.map((item) => item.value));
  const toCreate = values.filter((value) => !existingSet.has(value)).map((value) => ({ value }));
  if (toCreate.length) {
    await serviceModel.bulkCreate(toCreate, { transaction });
  }
  const all = await serviceModel.findAll({
    where: { value: { [Op.in]: values } },
    transaction,
  });
  await center.setServices(
    all.map((item) => item.id),
    { transaction }
  );
}

exports.list = async ({ q, city, primary, isActive, limit = 50, offset = 0 } = {}) => {
  const where = {};
  if (q) {
    where[Op.or] = [
      { title: { [Op.like]: `%${q}%` } },
      { city: { [Op.like]: `%${q}%` } },
      { slug: { [Op.like]: `%${q}%` } },
    ];
  }
  if (city) where.city = city;
  if (typeof primary !== "undefined") where.primary = primary;
  if (typeof isActive !== "undefined") where.isActive = isActive;

  const { rows, count } = await service_center.findAndCountAll({
    where,
    limit: Math.min(Number(limit) || 50, 200),
    offset: Number(offset) || 0,
    order: [["createdAt", "DESC"]],
    include: defaultInclude,
  });

  return { items: rows, total: count };
};

exports.get = async (id) => {
  return service_center.findByPk(id, { include: defaultInclude });
};

exports.getBySlug = async (slug) => {
  return service_center.findOne({ where: { slug }, include: defaultInclude });
};

exports.create = async (payload) => {
  const { contacts, services, ...data } = payload || {};
  if (data.title || data.slug) {
    const base = data.slug || data.title;
    data.slug = await generateUniqueSlug(service_center, base);
  }
  const created = await service_center.sequelize.transaction(async (transaction) => {
    const center = await service_center.create(data, { transaction });
    await syncContacts(center.id, contacts, transaction);
    await syncServices(center, services, transaction);
    return center;
  });
  return exports.get(created.id);
};

exports.update = async (id, payload) => {
  const { contacts, services, ...data } = payload || {};
  if (data.title || data.slug) {
    const base = data.slug || data.title;
    data.slug = await generateUniqueSlug(service_center, base, { idToExclude: id });
  }
  await service_center.sequelize.transaction(async (transaction) => {
    if (Object.keys(data).length) {
      await service_center.update(data, { where: { id }, transaction });
    }
    await syncContacts(id, contacts, transaction);
    const center =
      typeof services === "undefined"
        ? null
        : await service_center.findByPk(id, { transaction });
    await syncServices(center, services, transaction);
  });
  return exports.get(id);
};

exports.remove = async (id) => {
  return service_center.destroy({ where: { id } });
};
