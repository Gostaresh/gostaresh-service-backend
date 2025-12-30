"use strict";

const fs = require("fs");
const path = require("path");
const { randomUUID } = require("crypto");

const DATA_DIR = path.join(__dirname, "..", "..", "public-data");

function readJson(fileName) {
  const filePath = path.join(DATA_DIR, fileName);
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

function toJsonArray(value) {
  return Array.isArray(value) ? JSON.stringify(value) : null;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const t = await queryInterface.sequelize.transaction();
    try {
      const now = new Date();

      // product statuses
      const productStatuses = readJson("product-statuses.json");
      if (Array.isArray(productStatuses)) {
        const [existing] = await queryInterface.sequelize.query(
          "SELECT id FROM product_statuses",
          { transaction: t }
        );
        const existingIds = new Set((existing || []).map((row) => row.id));
        const rows = productStatuses
          .map((item) => {
            if (!item || !item.id) return null;
            if (existingIds.has(item.id)) return null;
            return {
              id: item.id,
              name: item.name || "",
              isActive: typeof item.isActive === "boolean" ? item.isActive : true,
              createdAt: now,
              updatedAt: now,
            };
          })
          .filter(Boolean);
        if (rows.length) {
          await queryInterface.bulkInsert("product_statuses", rows, {
            transaction: t,
          });
        }
      }

      // article types
      const articleTypes = readJson("article-types.json");
      if (Array.isArray(articleTypes)) {
        const [existing] = await queryInterface.sequelize.query(
          "SELECT id FROM article_types",
          { transaction: t }
        );
        const existingIds = new Set((existing || []).map((row) => row.id));
        const rows = articleTypes
          .map((item) => {
            if (!item || !item.id) return null;
            if (existingIds.has(item.id)) return null;
            return {
              id: item.id,
              name: item.name || "",
              isActive: typeof item.isActive === "boolean" ? item.isActive : true,
              createdAt: now,
              updatedAt: now,
            };
          })
          .filter(Boolean);
        if (rows.length) {
          await queryInterface.bulkInsert("article_types", rows, {
            transaction: t,
          });
        }
      }

      // brands
      const brands = readJson("brands.json");
      if (Array.isArray(brands)) {
        const [existing] = await queryInterface.sequelize.query(
          "SELECT id, slug FROM brands",
          { transaction: t }
        );
        const existingIds = new Set((existing || []).map((row) => row.id));
        const existingSlugs = new Set((existing || []).map((row) => row.slug));
        const rows = brands
          .map((item) => {
            if (!item || !item.id || !item.slug) return null;
            if (existingIds.has(item.id) || existingSlugs.has(item.slug))
              return null;
            return {
              id: item.id,
              name: item.name || item.slug,
              description: item.description || null,
              image: item.image || null,
              logo: item.logo || null,
              summary: item.summary || null,
              tags: toJsonArray(item.tags),
              slug: item.slug,
              isActive: typeof item.isActive === "boolean" ? item.isActive : true,
              createdAt: now,
              updatedAt: now,
            };
          })
          .filter(Boolean);
        if (rows.length) {
          await queryInterface.bulkInsert("brands", rows, { transaction: t });
        }
      }

      // categories
      const categories = readJson("categories.json");
      if (categories && typeof categories === "object") {
        const parents = safeArray(categories.parents);
        const children = safeArray(categories.children);

        const [existing] = await queryInterface.sequelize.query(
          "SELECT id, slug FROM categories",
          { transaction: t }
        );
        const existingIds = new Set((existing || []).map((row) => row.id));
        const existingSlugs = new Set((existing || []).map((row) => row.slug));

        const parentRows = parents
          .map((item, index) => {
            if (!item || !item.id || !item.slug) return null;
            if (existingIds.has(item.id) || existingSlugs.has(item.slug))
              return null;
            return {
              id: item.id,
              name: item.name || item.title || item.slug,
              title: item.title || null,
              parentID: null,
              slug: item.slug,
              image: item.image || null,
              summary: item.summary || null,
              tags: toJsonArray(item.tags),
              isActive: typeof item.isActive === "boolean" ? item.isActive : true,
              createdAt: now,
              updatedAt: now,
            };
          })
          .filter(Boolean);
        if (parentRows.length) {
          await queryInterface.bulkInsert("categories", parentRows, {
            transaction: t,
          });
        }

        const [catRows] = await queryInterface.sequelize.query(
          "SELECT id, slug FROM categories",
          { transaction: t }
        );
        const categorySlugToId = new Map(
          (catRows || []).map((row) => [row.slug, row.id])
        );

        const childRows = children
          .map((item) => {
            if (!item || !item.id || !item.slug) return null;
            if (existingIds.has(item.id) || existingSlugs.has(item.slug))
              return null;
            const parentID =
              item.parentID ||
              (item.parentSlug ? categorySlugToId.get(item.parentSlug) : null);
            return {
              id: item.id,
              name: item.name || item.title || item.slug,
              title: item.title || null,
              parentID: parentID || null,
              slug: item.slug,
              image: item.image || null,
              summary: item.summary || null,
              tags: toJsonArray(item.tags),
              isActive: typeof item.isActive === "boolean" ? item.isActive : true,
              createdAt: now,
              updatedAt: now,
            };
          })
          .filter(Boolean);
        if (childRows.length) {
          await queryInterface.bulkInsert("categories", childRows, {
            transaction: t,
          });
        }
      }

      // products + galleries
      const products = readJson("products.json");
      if (Array.isArray(products)) {
        const [existing] = await queryInterface.sequelize.query(
          "SELECT id, slug FROM products",
          { transaction: t }
        );
        const existingIds = new Set((existing || []).map((row) => row.id));
        const existingSlugs = new Set((existing || []).map((row) => row.slug));

        const [brandRows] = await queryInterface.sequelize.query(
          "SELECT id, slug, name FROM brands",
          { transaction: t }
        );
        const brandSlugToId = new Map(
          (brandRows || []).map((row) => [row.slug, row.id])
        );
        const brandNameToId = new Map(
          (brandRows || []).map((row) => [row.name, row.id])
        );

        const [catRows] = await queryInterface.sequelize.query(
          "SELECT id, slug FROM categories",
          { transaction: t }
        );
        const categorySlugToId = new Map(
          (catRows || []).map((row) => [row.slug, row.id])
        );

        const rows = [];
        const galleryRows = [];
        for (const item of products) {
          if (!item) continue;
          const id = item.id || randomUUID();
          if (existingIds.has(id) || existingSlugs.has(item.slug)) continue;

          const brandID =
            item.brandID ||
            (item.brandSlug ? brandSlugToId.get(item.brandSlug) : null) ||
            (item.brand ? brandNameToId.get(item.brand) : null);
          const categoryID =
            item.categoryID ||
            (item.childCategory ? categorySlugToId.get(item.childCategory) : null) ||
            (item.parentCategory ? categorySlugToId.get(item.parentCategory) : null);

          const name = item.name || item.title || item.slug || "product";
          rows.push({
            id,
            name,
            title: item.title || name,
            shortDescription: item.shortDescription || item.summary || null,
            longDescription: item.longDescription || item.description || null,
            summary: item.summary || item.shortDescription || null,
            description: item.description || item.longDescription || null,
            features: toJsonArray(item.features),
            tags: toJsonArray(item.tags),
            featured: Boolean(item.featured),
            legacyId: item.legacyId || null,
            price:
              typeof item.price === "number"
                ? item.price
                : typeof item.priceToman === "number"
                ? item.priceToman
                : null,
            createdBy: null,
            statusID: item.statusID || null,
            brandID: brandID || null,
            categoryID: categoryID || null,
            slug: item.slug || name,
            isActive: typeof item.isActive === "boolean" ? item.isActive : true,
            createdAt: now,
            updatedAt: now,
          });

          const gallery = Array.isArray(item.gallery) ? item.gallery : [];
          gallery.forEach((pathValue, index) => {
            const path = String(pathValue || "").trim();
            if (!path) return;
            const parts = path.split("/");
            const fileName = parts[parts.length - 1] || path;
            galleryRows.push({
              id: randomUUID(),
              fileName,
              path,
              productID: id,
              isMain: index === 0,
              isActive: true,
              createdAt: now,
              updatedAt: now,
            });
          });
        }
        if (rows.length) {
          await queryInterface.bulkInsert("products", rows, {
            transaction: t,
          });
        }
        if (galleryRows.length) {
          await queryInterface.bulkInsert("galleries", galleryRows, {
            transaction: t,
          });
        }
      }

      // blogs -> articles
      const blogs = readJson("blogs.json");
      if (Array.isArray(blogs)) {
        const [existing] = await queryInterface.sequelize.query(
          "SELECT id, slug FROM articles",
          { transaction: t }
        );
        const existingIds = new Set((existing || []).map((row) => row.id));
        const existingSlugs = new Set((existing || []).map((row) => row.slug));
        const rows = blogs
          .map((item) => {
            if (!item || !item.id || !item.slug) return null;
            if (existingIds.has(item.id) || existingSlugs.has(item.slug))
              return null;
            return {
              id: item.id,
              title: item.title || "",
              excerpt: item.excerpt || null,
              cover: item.cover || null,
              date: item.date || null,
              readMinutes: item.readMinutes || null,
              tags: toJsonArray(item.tags),
              hot: Boolean(item.hot),
              content: item.content || item.longContent || null,
              shortContent: item.shortContent || item.excerpt || null,
              longContent: item.longContent || item.content || null,
              articleTypeID: item.articleTypeID || null,
              userID: null,
              slug: item.slug,
              isActive: typeof item.isActive === "boolean" ? item.isActive : true,
              createdAt: now,
              updatedAt: now,
            };
          })
          .filter(Boolean);
        if (rows.length) {
          await queryInterface.bulkInsert("articles", rows, { transaction: t });
        }
      }

      // downloads
      const downloads = readJson("downloads.json");
      if (Array.isArray(downloads)) {
        const [existing] = await queryInterface.sequelize.query(
          "SELECT id FROM downloads",
          { transaction: t }
        );
        const existingIds = new Set((existing || []).map((row) => row.id));
        const rows = downloads
          .map((item, index) => {
            if (!item || !item.id) return null;
            if (existingIds.has(item.id)) return null;
            return {
              id: item.id,
              title: item.title || "",
              file: item.file || "",
              updated: item.updated || null,
              sortOrder: index + 1,
              createdAt: now,
              updatedAt: now,
            };
          })
          .filter(Boolean);
        if (rows.length) {
          await queryInterface.bulkInsert("downloads", rows, {
            transaction: t,
          });
        }
      }

      // pre-send tips
      const preSendTips = readJson("pre-send-tips.json");
      if (Array.isArray(preSendTips)) {
        await queryInterface.bulkDelete("pre_send_tips", {}, { transaction: t });
        const rows = preSendTips
          .map((tip, index) => {
            const content = String(tip || "").trim();
            if (!content) return null;
            return {
              id: randomUUID(),
              content,
              sortOrder: index + 1,
              createdAt: now,
              updatedAt: now,
            };
          })
          .filter(Boolean);
        if (rows.length) {
          await queryInterface.bulkInsert("pre_send_tips", rows, {
            transaction: t,
          });
        }
      }

      // policies
      const policies = readJson("policies.json");
      if (Array.isArray(policies)) {
        const [existing] = await queryInterface.sequelize.query(
          "SELECT id FROM policies",
          { transaction: t }
        );
        const existingIds = new Set((existing || []).map((row) => row.id));
        const rows = policies
          .map((item, index) => {
            if (!item || !item.id) return null;
            if (existingIds.has(item.id)) return null;
            const duration = item.duration || {};
            return {
              id: String(item.id),
              brand: item.brand || "",
              category: item.category || "",
              product: item.product || null,
              durationValue:
                typeof duration.value === "number" ? duration.value : null,
              durationUnit: duration.unit || null,
              sortOrder: index + 1,
              createdAt: now,
              updatedAt: now,
            };
          })
          .filter(Boolean);
        if (rows.length) {
          await queryInterface.bulkInsert("policies", rows, { transaction: t });
        }
      }

      // home features
      const homeFeatures = readJson("home-features.json");
      if (Array.isArray(homeFeatures)) {
        await queryInterface.bulkDelete("home_features", {}, { transaction: t });
        const rows = homeFeatures
          .map((item, index) => {
            if (!item) return null;
            return {
              id: randomUUID(),
              title: item.title || "",
              description: item.desc || null,
              icon: item.icon || null,
              bg: item.bg || null,
              dot: item.dot || null,
              sortOrder: index + 1,
              createdAt: now,
              updatedAt: now,
            };
          })
          .filter(Boolean);
        if (rows.length) {
          await queryInterface.bulkInsert("home_features", rows, {
            transaction: t,
          });
        }
      }

      // hero slides
      const heroSlides = readJson("hero-slides.json");
      if (Array.isArray(heroSlides)) {
        await queryInterface.bulkDelete("hero_slides", {}, { transaction: t });
        const rows = heroSlides
          .map((item, index) => {
            if (!item) return null;
            return {
              id: randomUUID(),
              title: item.title || "",
              subtitle: item.subtitle || null,
              description: item.description || null,
              ctaLabel: item.ctaLabel || null,
              ctaLink: item.ctaLink || null,
              image: item.image || null,
              sortOrder: index + 1,
              createdAt: now,
              updatedAt: now,
            };
          })
          .filter(Boolean);
        if (rows.length) {
          await queryInterface.bulkInsert("hero_slides", rows, {
            transaction: t,
          });
        }
      }

      // home timeline
      const homeTimeline = readJson("home-timeline.json");
      if (Array.isArray(homeTimeline)) {
        await queryInterface.bulkDelete("home_timeline_items", {}, {
          transaction: t,
        });
        const rows = homeTimeline
          .map((item, index) => {
            if (!item) return null;
            return {
              id: randomUUID(),
              title: item.title || "",
              description: item.desc || null,
              sortOrder: index + 1,
              createdAt: now,
              updatedAt: now,
            };
          })
          .filter(Boolean);
        if (rows.length) {
          await queryInterface.bulkInsert("home_timeline_items", rows, {
            transaction: t,
          });
        }
      }

      // quick contacts
      const quickContacts = readJson("quick-contacts.json");
      if (quickContacts && typeof quickContacts === "object") {
        await queryInterface.bulkDelete("quick_contacts", {}, { transaction: t });
        await queryInterface.bulkInsert(
          "quick_contacts",
          [
            {
              id: randomUUID(),
              phone: quickContacts.phone || null,
              whatsapp: quickContacts.whatsapp || null,
              email: quickContacts.email || null,
              ticket: quickContacts.ticket || null,
              createdAt: now,
              updatedAt: now,
            },
          ],
          { transaction: t }
        );
      }

      // service stats
      const serviceStats = readJson("service-stats.json");
      if (Array.isArray(serviceStats)) {
        const [existing] = await queryInterface.sequelize.query(
          "SELECT id FROM service_stats",
          { transaction: t }
        );
        const existingIds = new Set((existing || []).map((row) => row.id));
        const rows = serviceStats
          .map((item, index) => {
            if (!item || !item.id) return null;
            if (existingIds.has(item.id)) return null;
            return {
              id: item.id,
              label: item.label || "",
              value: typeof item.value === "number" ? item.value : 0,
              suffix: item.suffix || null,
              sortOrder: index + 1,
              createdAt: now,
              updatedAt: now,
            };
          })
          .filter(Boolean);
        if (rows.length) {
          await queryInterface.bulkInsert("service_stats", rows, {
            transaction: t,
          });
        }
      }

      // faq
      const faqItems = readJson("faq.json");
      if (Array.isArray(faqItems)) {
        await queryInterface.bulkDelete("faq_items", {}, { transaction: t });
        const rows = faqItems
          .map((item, index) => {
            if (!item) return null;
            return {
              id: randomUUID(),
              question: item.q || "",
              answer: item.a || "",
              sortOrder: index + 1,
              createdAt: now,
              updatedAt: now,
            };
          })
          .filter(Boolean);
        if (rows.length) {
          await queryInterface.bulkInsert("faq_items", rows, {
            transaction: t,
          });
        }
      }

      // abac rules
      const abacRules = readJson("abac-rules.json");
      if (abacRules && Array.isArray(abacRules.rules)) {
        await queryInterface.bulkDelete("abac_rules", {}, { transaction: t });
        const rows = abacRules.rules
          .map((rule) => {
            if (!rule || !rule.condition) return null;
            return {
              id: randomUUID(),
              resource: rule.resource || "",
              action: rule.action || "",
              conditionField: rule.condition.field || "",
              conditionOp: rule.condition.op || "",
              conditionValue: String(rule.condition.value || ""),
              createdAt: now,
              updatedAt: now,
            };
          })
          .filter(Boolean);
        if (rows.length) {
          await queryInterface.bulkInsert("abac_rules", rows, {
            transaction: t,
          });
        }
      }

      // rbac roles + permissions
      const rbac = readJson("rbac-roles.json");
      if (rbac && typeof rbac === "object") {
        const roleItems = Array.isArray(rbac.roles) ? rbac.roles : [];
        const permItems = Array.isArray(rbac.permissions)
          ? rbac.permissions
          : [];

        const [existingRoles] = await queryInterface.sequelize.query(
          "SELECT id, name FROM roles",
          { transaction: t }
        );
        const roleByName = new Map(
          (existingRoles || []).map((row) => [row.name, row.id])
        );

        for (const item of roleItems) {
          if (!item || !item.key) continue;
          const existingId = roleByName.get(item.key);
          if (!existingId) {
            const id = randomUUID();
            await queryInterface.bulkInsert(
              "roles",
              [
                {
                  id,
                  name: item.key,
                  title: item.name || null,
                  createdAt: now,
                  updatedAt: now,
                },
              ],
              { transaction: t }
            );
            roleByName.set(item.key, id);
          } else if (item.name) {
            await queryInterface.bulkUpdate(
              "roles",
              { title: item.name, updatedAt: now },
              { id: existingId },
              { transaction: t }
            );
          }
        }

        const [existingPerms] = await queryInterface.sequelize.query(
          "SELECT id, name FROM permissions",
          { transaction: t }
        );
        const permByName = new Map(
          (existingPerms || []).map((row) => [row.name, row.id])
        );

        const resourceMap = {
          products: "product",
          brands: "brand",
          categories: "category",
        };

        for (const perm of permItems) {
          if (!perm || !perm.resource || !Array.isArray(perm.actions)) continue;
          const mappedResource =
            resourceMap[perm.resource] || perm.resource || "";
          for (const action of perm.actions) {
            const name = `${mappedResource}.${action}`;
            let permId = permByName.get(name);
            if (!permId) {
              permId = randomUUID();
              await queryInterface.bulkInsert(
                "permissions",
                [
                  {
                    id: permId,
                    name,
                    resource: perm.resource,
                    action,
                    createdAt: now,
                    updatedAt: now,
                  },
                ],
                { transaction: t }
              );
              permByName.set(name, permId);
            }
            const roleKeys = Array.isArray(perm.roles) ? perm.roles : [];
            for (const roleKey of roleKeys) {
              const roleId = roleByName.get(roleKey);
              if (!roleId) continue;
              const [[existingBinding]] =
                await queryInterface.sequelize.query(
                  "SELECT 1 FROM role_permissions WHERE roleID = :roleID AND permissionID = :permissionID LIMIT 1",
                  {
                    replacements: { roleID: roleId, permissionID: permId },
                    transaction: t,
                  }
                );
              if (!existingBinding) {
                await queryInterface.bulkInsert(
                  "role_permissions",
                  [
                    {
                      roleID: roleId,
                      permissionID: permId,
                      createdAt: now,
                      updatedAt: now,
                    },
                  ],
                  { transaction: t }
                );
              }
            }
          }
        }
      }

      await t.commit();
    } catch (err) {
      await t.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    const t = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.bulkDelete("abac_rules", {}, { transaction: t });
      await queryInterface.bulkDelete("faq_items", {}, { transaction: t });
      await queryInterface.bulkDelete("service_stats", {}, { transaction: t });
      await queryInterface.bulkDelete("quick_contacts", {}, { transaction: t });
      await queryInterface.bulkDelete("home_timeline_items", {}, { transaction: t });
      await queryInterface.bulkDelete("hero_slides", {}, { transaction: t });
      await queryInterface.bulkDelete("home_features", {}, { transaction: t });
      await queryInterface.bulkDelete("policies", {}, { transaction: t });
      await queryInterface.bulkDelete("pre_send_tips", {}, { transaction: t });
      await queryInterface.bulkDelete("downloads", {}, { transaction: t });

      await t.commit();
    } catch (err) {
      await t.rollback();
      throw err;
    }
  },
};
