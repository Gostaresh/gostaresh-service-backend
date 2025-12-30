"use strict";

const fs = require("fs");
const path = require("path");
const { randomUUID } = require("crypto");

const DATA_PATH = path.join(
  __dirname,
  "..",
  "..",
  "public-data",
  "service-centers.json"
);

const DEFAULT_ITEMS = [
  {
    id: "default-service-center",
    slug: "default",
    title: "Default Service Center",
    city: "Tehran",
    tagline: "Primary service center",
    summary: "Default service center seeded for initial setup.",
    image: "/images/service-centers/default.png",
    primary: true,
    contact: {
      address: "No. 1, Example St, Tehran",
      hours: ["Sat-Thu 09:00-17:00", "Fri 09:00-13:00"],
      phones: ["021-00000000"],
      email: "support@example.com",
      mapLink: "https://maps.google.com/?q=35.699,51.337",
    },
    services: ["Warranty", "Repair", "Consulting"],
  },
];

function loadSeedItems() {
  let raw;
  try {
    raw = fs.readFileSync(DATA_PATH, "utf8");
  } catch (err) {
    return DEFAULT_ITEMS;
  }

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch (err) {
    return DEFAULT_ITEMS;
  }

  return DEFAULT_ITEMS;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const items = loadSeedItems();
    if (!Array.isArray(items) || items.length === 0) return;

    const t = await queryInterface.sequelize.transaction();
    try {
      const [existing] = await queryInterface.sequelize.query(
        "SELECT id, slug FROM service_centers",
        { transaction: t }
      );
      const existingIds = new Set((existing || []).map((row) => row.id));
      const existingSlugs = new Set((existing || []).map((row) => row.slug));
      const now = new Date();

      const newItems = [];
      const rows = items
        .map((item) => {
          if (!item || typeof item !== "object") return null;
          const id = String(item.id || "").trim() || randomUUID();
          const slug = String(item.slug || "").trim();
          if (!slug) return null;
          if (existingIds.has(id) || existingSlugs.has(slug)) return null;

          newItems.push({ id, item });
          return {
            id,
            slug,
            title: item.title || slug,
            city: item.city || null,
            tagline: item.tagline || null,
            summary: item.summary || null,
            image: item.image || null,
            primary: Boolean(item.primary),
            isActive: true,
            createdAt: now,
            updatedAt: now,
          };
        })
        .filter(Boolean);

      if (rows.length) {
        await queryInterface.bulkInsert("service_centers", rows, {
          transaction: t,
        });
      }

      if (newItems.length) {
        const contactRows = [];
        const serviceValueSet = new Set();
        const centerServices = new Map();

        for (const { id, item } of newItems) {
          const contact =
            item.contact && typeof item.contact === "object"
              ? item.contact
              : null;
          if (contact) {
            for (const [title, value] of Object.entries(contact)) {
              if (Array.isArray(value)) {
                for (const entry of value) {
                  const v = String(entry ?? "").trim();
                  if (!v) continue;
                  contactRows.push({
                    id: randomUUID(),
                    serviceCenterID: id,
                    title,
                    value: v,
                    createdAt: now,
                    updatedAt: now,
                  });
                }
              } else if (value !== null && typeof value !== "undefined") {
                const v = String(value).trim();
                if (!v) continue;
                contactRows.push({
                  id: randomUUID(),
                  serviceCenterID: id,
                  title,
                  value: v,
                  createdAt: now,
                  updatedAt: now,
                });
              }
            }
          }

          const services = Array.isArray(item.services) ? item.services : [];
          const normalized = services
            .map((value) => String(value || "").trim())
            .filter(Boolean);
          const deduped = Array.from(new Set(normalized));
          if (deduped.length) {
            centerServices.set(id, deduped);
            deduped.forEach((value) => serviceValueSet.add(value));
          }
        }

        if (contactRows.length) {
          await queryInterface.bulkInsert(
            "service_center_contacts",
            contactRows,
            { transaction: t }
          );
        }

        const serviceValues = Array.from(serviceValueSet);
        let serviceValueToId = new Map();
        if (serviceValues.length) {
          const [existingServices] = await queryInterface.sequelize.query(
            "SELECT id, value FROM services WHERE value IN (:values)",
            { replacements: { values: serviceValues }, transaction: t }
          );
          const existingMap = new Map(
            (existingServices || []).map((row) => [row.value, row.id])
          );
          const toCreate = serviceValues
            .filter((value) => !existingMap.has(value))
            .map((value) => ({
              id: randomUUID(),
              value,
              createdAt: now,
              updatedAt: now,
            }));
          if (toCreate.length) {
            await queryInterface.bulkInsert("services", toCreate, {
              transaction: t,
            });
          }
          const [allServices] = await queryInterface.sequelize.query(
            "SELECT id, value FROM services WHERE value IN (:values)",
            { replacements: { values: serviceValues }, transaction: t }
          );
          serviceValueToId = new Map(
            (allServices || []).map((row) => [row.value, row.id])
          );
        }

        const joinRows = [];
        for (const [centerId, values] of centerServices.entries()) {
          for (const value of values) {
            const serviceId = serviceValueToId.get(value);
            if (!serviceId) continue;
            joinRows.push({
              serviceCenterID: centerId,
              serviceID: serviceId,
              createdAt: now,
              updatedAt: now,
            });
          }
        }
        if (joinRows.length) {
          await queryInterface.bulkInsert(
            "service_center_services",
            joinRows,
            { transaction: t }
          );
        }
      }

      await t.commit();
    } catch (err) {
      await t.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    const items = loadSeedItems();
    if (!Array.isArray(items) || items.length === 0) return;

    const ids = new Set(
      items.map((item) => (item && item.id ? String(item.id) : null)).filter(Boolean)
    );
    const slugs = items
      .map((item) => (item && item.slug ? String(item.slug) : null))
      .filter(Boolean);
    if (slugs.length) {
      const [rows] = await queryInterface.sequelize.query(
        "SELECT id FROM service_centers WHERE slug IN (:slugs)",
        { replacements: { slugs } }
      );
      (rows || []).forEach((row) => ids.add(row.id));
    }

    const idList = Array.from(ids.values());
    if (idList.length) {
      await queryInterface.bulkDelete(
        "service_center_services",
        { serviceCenterID: { [Sequelize.Op.in]: idList } },
        {}
      );
      await queryInterface.bulkDelete(
        "service_center_contacts",
        { serviceCenterID: { [Sequelize.Op.in]: idList } },
        {}
      );
    }

    const serviceValues = Array.from(
      new Set(
        items
          .flatMap((item) => (Array.isArray(item?.services) ? item.services : []))
          .map((value) => String(value || "").trim())
          .filter(Boolean)
      )
    );
    if (serviceValues.length) {
      await queryInterface.bulkDelete(
        "services",
        { value: { [Sequelize.Op.in]: serviceValues } },
        {}
      );
    }

    await queryInterface.bulkDelete(
      "service_centers",
      {
        [Sequelize.Op.or]: [
          { id: { [Sequelize.Op.in]: idList } },
          { slug: { [Sequelize.Op.in]: slugs } },
        ],
      },
      {}
    );
  },
};
