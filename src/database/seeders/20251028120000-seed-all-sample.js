"use strict";

const { randomUUID, createHash } = require("crypto");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const t = await queryInterface.sequelize.transaction();
    try {
      const now = new Date();

      // Helpers
      const q = (sql, repl = {}) =>
        queryInterface.sequelize.query(sql, { replacements: repl, transaction: t });
      const one = async (sql, repl = {}) => {
        const [rows] = await q(sql, repl);
        return rows && rows[0];
      };

      // Ensure admin user and superadmin role exist
      const saRole =
        (await one('SELECT id FROM roles WHERE name = :name LIMIT 1', { name: 'superadmin' })) ||
        (await (async () => {
          const id = randomUUID();
          await queryInterface.bulkInsert('roles', [{ id, name: 'superadmin', createdAt: now, updatedAt: now }], { transaction: t });
          return { id };
        })());

      const admin =
        (await one('SELECT id FROM users WHERE userName = :u LIMIT 1', { u: 'admin' })) ||
        (await (async () => {
          const id = randomUUID();
          const password = createHash('sha256').update('admin').digest('hex');
          await queryInterface.bulkInsert(
            'users',
            [{ id, firstName: 'Super', lastName: 'Admin', userName: 'admin', password, isActive: true, createdAt: now, updatedAt: now }],
            { transaction: t }
          );
          return { id };
        })());
      const bind = await one('SELECT 1 FROM user_roles WHERE userID = :u AND roleID = :r LIMIT 1', { u: admin.id, r: saRole.id });
      if (!bind) {
        await queryInterface.bulkInsert('user_roles', [{ userID: admin.id, roleID: saRole.id, createdAt: now, updatedAt: now }], { transaction: t });
      }

      // Product Statuses
      const statuses = ['Draft', 'Published', 'Archived'];
      const [existingStatuses] = await q('SELECT name,id FROM product_statuses');
      const haveStatuses = new Set((existingStatuses || []).map((r) => r.name));
      const statusRows = [];
      for (const name of statuses) {
        if (!haveStatuses.has(name)) {
          const id = randomUUID();
          statusRows.push({ id, name, isActive: true, createdAt: now, updatedAt: now });
        }
      }
      if (statusRows.length) await queryInterface.bulkInsert('product_statuses', statusRows, { transaction: t });
      const statusPublished = (await one('SELECT id FROM product_statuses WHERE name = :n LIMIT 1', { n: 'Published' })).id;

      // Brands
      const brands = [
        { name: 'Acme', slug: 'acme' },
        { name: 'Globex', slug: 'globex' },
      ];
      const [existingBrands] = await q('SELECT name FROM brands');
      const haveBrands = new Set((existingBrands || []).map((r) => r.name));
      const brandRows = brands
        .filter((b) => !haveBrands.has(b.name))
        .map((b) => ({ id: randomUUID(), name: b.name, description: `${b.name} brand`, image: null, slug: b.slug, isActive: true, createdAt: now, updatedAt: now }));
      if (brandRows.length) await queryInterface.bulkInsert('brands', brandRows, { transaction: t });
      const acme = await one('SELECT id FROM brands WHERE name = :n LIMIT 1', { n: 'Acme' });

      // Categories (Electronics > Laptops, Phones)
      const electronics =
        (await one('SELECT id FROM categories WHERE name = :n LIMIT 1', { n: 'Electronics' })) ||
        (await (async () => {
          const id = randomUUID();
          await queryInterface.bulkInsert('categories', [{ id, name: 'Electronics', parentID: null, slug: 'electronics', isActive: true, createdAt: now, updatedAt: now }], { transaction: t });
          return { id };
        })());
      const ensureCat = async (name, slug, parentID) => {
        const ex = await one('SELECT id FROM categories WHERE name = :n LIMIT 1', { n: name });
        if (ex) return ex;
        const id = randomUUID();
        await queryInterface.bulkInsert('categories', [{ id, name, parentID, slug, isActive: true, createdAt: now, updatedAt: now }], { transaction: t });
        return { id };
      };
      const laptops = await ensureCat('Laptops', 'laptops', electronics.id);
      const phones = await ensureCat('Phones', 'phones', electronics.id);

      // Article Types
      const atypes = ['blog', 'news', 'education'];
      const [existingTypes] = await q('SELECT name FROM article_types');
      const haveTypes = new Set((existingTypes || []).map((r) => r.name));
      const typeRows = atypes.filter((n) => !haveTypes.has(n)).map((name) => ({ id: randomUUID(), name, isActive: true, createdAt: now, updatedAt: now }));
      if (typeRows.length) await queryInterface.bulkInsert('article_types', typeRows, { transaction: t });
      const blogType = (await one('SELECT id FROM article_types WHERE name = :n LIMIT 1', { n: 'blog' })).id;

      // Articles
      const artExists = await one('SELECT id FROM articles WHERE title = :t LIMIT 1', { t: 'Welcome to our blog' });
      if (!artExists) {
        await queryInterface.bulkInsert(
          'articles',
          [{ id: randomUUID(), title: 'Welcome to our blog', shortContent: 'Intro', longContent: 'Hello world content', articleTypeID: blogType, userID: admin.id, slug: 'welcome-blog', isActive: true, createdAt: now, updatedAt: now }],
          { transaction: t }
        );
      }

      // Products
      const prodExists = await one('SELECT id FROM products WHERE name = :n LIMIT 1', { n: 'Acme Laptop Pro' });
      if (!prodExists) {
        const prodId = randomUUID();
        await queryInterface.bulkInsert(
          'products',
          [{ id: prodId, name: 'Acme Laptop Pro', shortDescription: 'Powerful laptop', longDescription: 'Detailed specs...', price: 25000000, createdBy: admin.id, statusID: statusPublished, brandID: acme.id, categoryID: laptops.id, slug: 'acme-laptop-pro', isActive: true, createdAt: now, updatedAt: now }],
          { transaction: t }
        );
        await queryInterface.bulkInsert(
          'galleries',
          [{ id: randomUUID(), fileName: 'laptop.jpg', path: '/uploads/sample/laptop.jpg', productID: prodId, isMain: true, isActive: true, createdAt: now, updatedAt: now }],
          { transaction: t }
        );
      }

      // Website Setting kinds
      const kinds = ['Herobanner', 'Features'];
      const [existingKinds] = await q('SELECT name FROM website_setting_kinds');
      const haveKinds = new Set((existingKinds || []).map((r) => r.name));
      const kindRows = kinds.filter((n) => !haveKinds.has(n)).map((name) => ({ id: randomUUID(), name, isActive: true, createdAt: now, updatedAt: now }));
      if (kindRows.length) await queryInterface.bulkInsert('website_setting_kinds', kindRows, { transaction: t });
      const heroKind = (await one('SELECT id FROM website_setting_kinds WHERE name = :n LIMIT 1', { n: 'Herobanner' }))?.id;
      if (heroKind) {
        const exists = await one('SELECT id FROM website_settings WHERE name = :n LIMIT 1', { n: 'HomepageHero' });
        if (!exists) {
          await queryInterface.bulkInsert(
            'website_settings',
            [{ id: randomUUID(), name: 'HomepageHero', title: 'Welcome to Gostaresh', description: 'Your trusted partner', image: '/uploads/sample/hero.jpg', attribute: null, href: '/', kindID: heroKind, isActive: true, createdAt: now, updatedAt: now }],
            { transaction: t }
          );
        }
      }

      // Warranty minimal seeds (optional)
      const wState = (await one('SELECT id FROM warranty_states WHERE name = :n LIMIT 1', { n: 'New' })) ||
        (await (async () => { try { const id = randomUUID(); await queryInterface.bulkInsert('warranty_states', [{ id, name: 'New', createdAt: now, updatedAt: now }], { transaction: t }); return { id }; } catch { return null; } })());
      const wProv = (await one('SELECT id FROM warranty_providers WHERE name = :n LIMIT 1', { n: 'DefaultProvider' })) ||
        (await (async () => { try { const id = randomUUID(); await queryInterface.bulkInsert('warranty_providers', [{ id, name: 'DefaultProvider', createdAt: now, updatedAt: now }], { transaction: t }); return { id }; } catch { return null; } })());
      if (wState && wProv) {
        // no-op; placeholders created if tables exist
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
      const names = {
        product_statuses: ['Draft', 'Published', 'Archived'],
        brands: ['Acme', 'Globex'],
        categories: ['Laptops', 'Phones', 'Electronics'],
        article_types: ['blog', 'news', 'education'],
        articles: ['Welcome to our blog'],
        website_settings: ['HomepageHero'],
        website_setting_kinds: ['Herobanner', 'Features'],
        warranty_states: ['New'],
        warranty_providers: ['DefaultProvider'],
      };
      const delByNames = async (table, col, arr) => {
        try {
          await queryInterface.bulkDelete(table, { [col]: { [Sequelize.Op.in]: arr } }, { transaction: t });
        } catch {}
      };
      await delByNames('website_settings', 'name', names.website_settings);
      await delByNames('website_setting_kinds', 'name', names.website_setting_kinds);
      await delByNames('galleries', 'fileName', ['laptop.jpg']);
      await delByNames('products', 'name', ['Acme Laptop Pro']);
      await delByNames('brands', 'name', names.brands);
      await delByNames('categories', 'name', names.categories);
      await delByNames('product_statuses', 'name', names.product_statuses);
      await delByNames('articles', 'title', names.articles);
      await delByNames('article_types', 'name', names.article_types);
      await delByNames('warranty_states', 'name', names.warranty_states);
      await delByNames('warranty_providers', 'name', names.warranty_providers);
      await t.commit();
    } catch (err) {
      await t.rollback();
      throw err;
    }
  },
};

