"use strict";

const {
  product_status,
  article_type,
  brand,
  category,
  product,
  gallery,
  article,
  download,
  pre_send_tip,
  policy,
  home_feature,
  hero_slide,
  home_timeline_item,
  quick_contact,
  service_stat,
  faq_item,
  abac_rule,
  role,
  permission,
  role_permission,
} = require("@/models");

const ALLOWED_KEYS = [
  "product-statuses",
  "article-types",
  "brands",
  "categories",
  "products",
  "blogs",
  "downloads",
  "pre-send-tips",
  "policies",
  "home-features",
  "hero-slides",
  "home-timeline",
  "quick-contacts",
  "service-stats",
  "faq",
  "abac-rules",
  "rbac-roles",
];

function normalizeKey(raw) {
  return String(raw || "")
    .trim()
    .replace(/\.json$/i, "");
}

function listKeys() {
  return [...ALLOWED_KEYS];
}

function normalizePermissionResource(resource) {
  const pluralMap = {
    product: "products",
    brand: "brands",
    category: "categories",
  };
  return pluralMap[resource] || resource;
}

function normalizePermission(perm) {
  let resource = perm.resource;
  let action = perm.action;
  if (!resource || !action) {
    const parts = String(perm.name || "").split(".");
    if (parts.length >= 2) {
      if (!resource) resource = parts[0];
      if (!action) action = parts[1];
    }
  }
  if (!resource || !action) return null;
  return {
    resource: normalizePermissionResource(String(resource)),
    action: String(action),
  };
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : null;
}

async function loadProductStatuses() {
  const items = await product_status.findAll({
    order: [["createdAt", "ASC"]],
  });
  return items.map((item) => ({
    id: item.id,
    name: item.name,
    isActive: item.isActive,
  }));
}

async function loadArticleTypes() {
  const items = await article_type.findAll({
    order: [["createdAt", "ASC"]],
  });
  return items.map((item) => ({
    id: item.id,
    name: item.name,
    isActive: item.isActive,
  }));
}

async function loadBrands() {
  const items = await brand.findAll({
    order: [["createdAt", "ASC"]],
  });
  return items.map((item) => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    logo: item.logo || item.image || null,
    summary: item.summary ?? null,
    tags: normalizeArray(item.tags),
    description: item.description ?? null,
    image: item.image ?? null,
    isActive: item.isActive,
  }));
}

async function loadCategories() {
  const items = await category.findAll({
    order: [["createdAt", "ASC"]],
  });
  const slugById = new Map(items.map((item) => [item.id, item.slug]));

  const parents = [];
  const children = [];
  for (const item of items) {
    const base = {
      id: item.id,
      slug: item.slug,
      title: item.title || item.name || item.slug,
      image: item.image ?? null,
      summary: item.summary ?? null,
      tags: normalizeArray(item.tags),
      name: item.name || item.title || item.slug,
      isActive: item.isActive,
    };
    if (item.parentID) {
      children.push({
        ...base,
        parentID: item.parentID,
        parentSlug: slugById.get(item.parentID) || null,
      });
    } else {
      parents.push(base);
    }
  }

  return { parents, children };
}

async function loadProducts() {
  const categories = await category.findAll({
    attributes: ["id", "slug", "parentID"],
  });
  const categoryById = new Map(categories.map((item) => [item.id, item]));

  const items = await product.findAll({
    include: [
      { model: brand, as: "brand", attributes: ["id", "slug", "name"] },
      { model: category, as: "category", attributes: ["id", "slug", "parentID"] },
      { model: product_status, as: "status", attributes: ["id", "name"] },
      { model: gallery, as: "galleries", attributes: ["path", "isMain", "createdAt"] },
    ],
    order: [["createdAt", "ASC"]],
  });

  return items.map((item) => {
    const cat = item.category ? categoryById.get(item.category.id) || item.category : null;
    const parentCat = cat && cat.parentID ? categoryById.get(cat.parentID) : null;

    const galleries = Array.isArray(item.galleries) ? [...item.galleries] : [];
    galleries.sort((a, b) => {
      const mainDiff = Number(Boolean(b.isMain)) - Number(Boolean(a.isMain));
      if (mainDiff !== 0) return mainDiff;
      return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
    });

    const title = item.title ?? item.name ?? null;
    const name = item.name ?? item.title ?? null;
    const summary = item.summary ?? item.shortDescription ?? null;
    const description = item.description ?? item.longDescription ?? null;
    const shortDescription = item.shortDescription ?? item.summary ?? null;
    const longDescription = item.longDescription ?? item.description ?? null;

    return {
      id: item.id,
      slug: item.slug,
      title,
      brandSlug: item.brand ? item.brand.slug : null,
      parentCategory: parentCat ? parentCat.slug : cat ? cat.slug : null,
      childCategory: cat && cat.parentID ? cat.slug : null,
      priceToman: typeof item.price === "number" ? item.price : null,
      gallery: galleries.map((g) => g.path).filter(Boolean),
      summary,
      description,
      features: normalizeArray(item.features),
      tags: normalizeArray(item.tags),
      featured: Boolean(item.featured),
      status: item.status ? item.status.name : null,
      legacyId: item.legacyId ?? null,
      name,
      shortDescription,
      longDescription,
      price: item.price,
      isActive: item.isActive,
      brandID: item.brandID,
      categoryID: item.categoryID,
      statusID: item.statusID,
    };
  });
}

async function loadBlogs() {
  const items = await article.findAll({
    order: [["createdAt", "DESC"]],
  });
  return items.map((item) => ({
    slug: item.slug,
    title: item.title,
    excerpt: item.excerpt ?? item.shortContent ?? null,
    cover: item.cover ?? null,
    date: item.date ?? null,
    readMinutes: typeof item.readMinutes === "number" ? item.readMinutes : null,
    tags: normalizeArray(item.tags),
    hot: Boolean(item.hot),
    content: item.content ?? item.longContent ?? null,
    id: item.id,
    shortContent: item.shortContent ?? item.excerpt ?? null,
    longContent: item.longContent ?? item.content ?? null,
    articleTypeID: item.articleTypeID,
    isActive: item.isActive,
  }));
}

async function loadDownloads() {
  const items = await download.findAll({
    order: [
      ["sortOrder", "ASC"],
      ["createdAt", "ASC"],
    ],
  });
  return items.map((item) => ({
    id: item.id,
    title: item.title,
    file: item.file,
    updated: item.updated ?? null,
  }));
}

async function loadPreSendTips() {
  const items = await pre_send_tip.findAll({
    order: [["sortOrder", "ASC"]],
  });
  return items.map((item) => item.content);
}

async function loadPolicies() {
  const items = await policy.findAll({
    order: [
      ["sortOrder", "ASC"],
      ["createdAt", "ASC"],
    ],
  });
  return items.map((item) => ({
    id: item.id,
    brand: item.brand,
    category: item.category,
    product: item.product ?? null,
    duration: {
      value: item.durationValue,
      unit: item.durationUnit ?? null,
    },
    conditions: item.conditions ?? null,
  }));
}

async function loadHomeFeatures() {
  const items = await home_feature.findAll({
    order: [["sortOrder", "ASC"]],
  });
  return items.map((item) => ({
    title: item.title,
    desc: item.description ?? null,
    icon: item.icon ?? null,
    bg: item.bg ?? null,
    dot: item.dot ?? null,
  }));
}

async function loadHeroSlides() {
  const items = await hero_slide.findAll({
    order: [["sortOrder", "ASC"]],
  });
  return items.map((item) => ({
    title: item.title,
    subtitle: item.subtitle ?? null,
    description: item.description ?? null,
    ctaLabel: item.ctaLabel ?? null,
    ctaLink: item.ctaLink ?? null,
    image: item.image ?? null,
  }));
}

async function loadHomeTimeline() {
  const items = await home_timeline_item.findAll({
    order: [["sortOrder", "ASC"]],
  });
  return items.map((item) => ({
    title: item.title,
    desc: item.description ?? null,
  }));
}

async function loadQuickContacts() {
  const item = await quick_contact.findOne({
    order: [["createdAt", "DESC"]],
  });
  if (!item) {
    return { phone: null, whatsapp: null, email: null, ticket: null };
  }
  return {
    phone: item.phone ?? null,
    whatsapp: item.whatsapp ?? null,
    email: item.email ?? null,
    ticket: item.ticket ?? null,
  };
}

async function loadServiceStats() {
  const items = await service_stat.findAll({
    order: [
      ["sortOrder", "ASC"],
      ["createdAt", "ASC"],
    ],
  });
  return items.map((item) => ({
    id: item.id,
    label: item.label,
    value: item.value,
    suffix: item.suffix ?? null,
  }));
}

async function loadFaq() {
  const items = await faq_item.findAll({
    order: [
      ["sortOrder", "ASC"],
      ["createdAt", "ASC"],
    ],
  });
  return items.map((item) => ({
    q: item.question,
    a: item.answer,
  }));
}

async function loadAbacRules() {
  const items = await abac_rule.findAll({
    order: [["createdAt", "ASC"]],
  });
  return {
    rules: items.map((item) => ({
      resource: item.resource,
      action: item.action,
      condition: {
        field: item.conditionField,
        op: item.conditionOp,
        value: item.conditionValue,
      },
    })),
  };
}

async function loadRbacRoles() {
  const roles = await role.findAll({
    order: [["createdAt", "ASC"]],
  });
  const visibleRoles = roles.filter((item) => item.name !== "superadmin");
  const roleIdToKey = new Map(
    visibleRoles.map((item) => [item.id, item.name])
  );

  const rolePayload = visibleRoles.map((item) => ({
    key: item.name,
    name: item.title || item.name,
  }));

  const perms = await permission.findAll({
    order: [["createdAt", "ASC"]],
  });
  const rolePerms = await role_permission.findAll();

  const rolesByPermId = new Map();
  for (const binding of rolePerms) {
    const roleKey = roleIdToKey.get(binding.roleID);
    if (!roleKey) continue;
    if (!rolesByPermId.has(binding.permissionID)) {
      rolesByPermId.set(binding.permissionID, new Set());
    }
    rolesByPermId.get(binding.permissionID).add(roleKey);
  }

  const grouped = new Map();
  for (const perm of perms) {
    const normalized = normalizePermission(perm);
    if (!normalized) continue;
    const roleSet = rolesByPermId.get(perm.id);
    if (!roleSet || roleSet.size === 0) continue;
    const rolesList = Array.from(roleSet).sort();
    const key = `${normalized.resource}||${rolesList.join("|")}`;
    if (!grouped.has(key)) {
      grouped.set(key, {
        resource: normalized.resource,
        actions: [],
        roles: rolesList,
      });
    }
    grouped.get(key).actions.push(normalized.action);
  }

  const permissionsPayload = Array.from(grouped.values())
    .map((item) => ({
      resource: item.resource,
      actions: Array.from(new Set(item.actions)).sort(),
      roles: item.roles,
    }))
    .sort((a, b) => a.resource.localeCompare(b.resource));

  return { roles: rolePayload, permissions: permissionsPayload };
}

const handlers = {
  "product-statuses": loadProductStatuses,
  "article-types": loadArticleTypes,
  brands: loadBrands,
  categories: loadCategories,
  products: loadProducts,
  blogs: loadBlogs,
  downloads: loadDownloads,
  "pre-send-tips": loadPreSendTips,
  policies: loadPolicies,
  "home-features": loadHomeFeatures,
  "hero-slides": loadHeroSlides,
  "home-timeline": loadHomeTimeline,
  "quick-contacts": loadQuickContacts,
  "service-stats": loadServiceStats,
  faq: loadFaq,
  "abac-rules": loadAbacRules,
  "rbac-roles": loadRbacRoles,
};

async function loadForKey(key) {
  const normalized = normalizeKey(key);
  if (!ALLOWED_KEYS.includes(normalized)) return null;
  const handler = handlers[normalized];
  if (!handler) return null;
  return handler();
}

module.exports = {
  listKeys,
  loadForKey,
  normalizeKey,
};
