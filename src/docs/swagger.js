"use strict";

const pkg = require("../../package.json");

// Static base spec (you can extend later or switch to swagger-jsdoc scanning)
const swaggerSpec = {
  openapi: "3.0.3",
  info: {
    title: "Gostaresh Service Admin API",
    version: pkg.version || "1.0.0",
    description: "API documentation for the admin panel",
  },
  servers: [
    { url: "/api/v1", description: "Main API" },
    { url: "/", description: "Public endpoints (/public)" },
  ],
  tags: [
    { name: "Auth" },
    { name: "Users" },
    { name: "Products" },
    { name: "Categories" },
    { name: "Brands" },
    { name: "Galleries" },
    { name: "Articles" },
    { name: "Permissions" },
    { name: "Roles" },
    { name: "ProductStatuses" },
    { name: "Upload" },
    { name: "Utils" },
    { name: "WebsiteSettings" },
    { name: "WebsiteSettingKinds" },
    { name: "ServiceCenters" },
    { name: "Warranty" },
    { name: "Public" },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      LoginRequest: {
        type: "object",
        required: ["userName", "password"],
        properties: {
          userName: { type: "string", example: "admin" },
          password: { type: "string", example: "admin" },
        },
      },
      LoginResponse: {
        type: "object",
        properties: {
          token: { type: "string" },
          user: { type: "object" },
        },
      },
      MeResponse: {
        type: "object",
        properties: {
          auth: {
            type: "object",
            properties: {
              sub: { type: "string", description: "User ID (subject)" },
              roles: { type: "array", items: { type: "string" } },
              perms: { type: "array", items: { type: "string" } },
            },
          },
          user: { $ref: "#/components/schemas/User" },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: { message: { type: "string" } },
      },
      PageResult: {
        type: "object",
        properties: {
          items: { type: "array", items: { type: "object" } },
          total: { type: "integer" },
        },
      },
      User: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          firstName: { type: "string" },
          lastName: { type: "string" },
          userName: { type: "string" },
          email: { type: "string" },
          isActive: { type: "boolean" },
        },
      },
      Product: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string" },
          slug: { type: "string" },
          price: { type: "integer" },
          isActive: { type: "boolean" },
        },
      },
      Brand: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string" },
          description: { type: "string" },
          image: { type: "string" },
          slug: { type: "string" },
          isActive: { type: "boolean" },
        },
      },
      Category: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string" },
          parentID: { type: "string", format: "uuid", nullable: true },
          slug: { type: "string" },
          isActive: { type: "boolean" },
        },
      },
      Gallery: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          productID: { type: "string", format: "uuid" },
          fileName: { type: "string" },
          path: { type: "string" },
          isMain: { type: "boolean" },
          isActive: { type: "boolean" },
        },
      },
      Article: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          title: { type: "string" },
          slug: { type: "string" },
          articleTypeID: { type: "string", format: "uuid" },
          userID: { type: "string", format: "uuid" },
          isActive: { type: "boolean" },
        },
      },
      ArticleType: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string", enum: ["blog", "news", "education"] },
          isActive: { type: "boolean" },
        },
      },
      ArticleTypeUpsertRequest: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string" },
        },
      },
      WebsiteSetting: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string" },
          title: { type: "string" },
          description: { type: "string" },
          image: { type: "string" },
          attribute: { type: "string" },
          href: { type: "string" },
          kindID: { type: "string", format: "uuid" },
          isActive: { type: "boolean" },
        },
      },
      WebsiteSettingKind: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string" },
          isActive: { type: "boolean" },
        },
      },
      ServiceCenterContact: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          title: { type: "string" },
          value: { type: "string" },
        },
      },
      Service: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          value: { type: "string" },
        },
      },
      ServiceCenter: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          title: { type: "string" },
          city: { type: "string" },
          tagline: { type: "string" },
          summary: { type: "string" },
          image: { type: "string" },
          primary: { type: "boolean" },
          contacts: {
            type: "array",
            items: { $ref: "#/components/schemas/ServiceCenterContact" },
          },
          services: {
            type: "array",
            items: { $ref: "#/components/schemas/Service" },
          },
          isActive: { type: "boolean" },
        },
      },
      UploadSingleResponse: {
        type: "object",
        properties: {
          path: { type: "string" },
          fileName: { type: "string" },
          originalName: { type: "string" },
          mimetype: { type: "string" },
          size: { type: "integer" },
        },
      },
      UploadMultiResponse: {
        type: "object",
        properties: {
          files: {
            type: "array",
            items: { $ref: "#/components/schemas/UploadSingleResponse" },
          },
        },
      },
      CreateProductRequest: {
        type: "object",
        required: ["name", "price"],
        properties: {
          name: { type: "string" },
          shortDescription: { type: "string" },
          longDescription: { type: "string" },
          price: { type: "integer" },
          statusID: { type: "string", format: "uuid" },
          brandID: { type: "string", format: "uuid" },
          categoryID: { type: "string", format: "uuid" },
          slug: { type: "string" },
          isActive: { type: "boolean" },
        },
      },
      UpdateProductRequest: {
        allOf: [{ $ref: "#/components/schemas/CreateProductRequest" }],
      },
      CreateBrandRequest: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          image: { type: "string" },
          slug: { type: "string" },
          isActive: { type: "boolean" },
        },
      },
      UpdateBrandRequest: {
        allOf: [{ $ref: "#/components/schemas/CreateBrandRequest" }],
      },
      CreateCategoryRequest: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string" },
          parentID: { type: "string", format: "uuid", nullable: true },
          slug: { type: "string" },
          isActive: { type: "boolean" },
        },
      },
      UpdateCategoryRequest: {
        allOf: [{ $ref: "#/components/schemas/CreateCategoryRequest" }],
      },
      CreateArticleRequest: {
        type: "object",
        required: ["title"],
        properties: {
          title: { type: "string" },
          shortContent: { type: "string" },
          longContent: { type: "string" },
          articleTypeID: { type: "string", format: "uuid" },
          slug: { type: "string" },
          isActive: { type: "boolean" },
        },
      },
      UpdateArticleRequest: {
        allOf: [{ $ref: "#/components/schemas/CreateArticleRequest" }],
      },
      CreateUserRequest: {
        type: "object",
        required: ["userName", "password"],
        properties: {
          firstName: { type: "string" },
          lastName: { type: "string" },
          userName: { type: "string" },
          email: { type: "string" },
          password: { type: "string" },
        },
      },
      GalleryAddRequest: {
        type: "object",
        required: ["path", "fileName"],
        properties: {
          path: {
            type: "string",
            description:
              "Relative path under /uploads returned by upload service",
          },
          fileName: { type: "string" },
          isMain: { type: "boolean" },
          isActive: { type: "boolean" },
        },
      },
      CreateWebsiteSettingRequest: {
        type: "object",
        required: ["name", "kindID"],
        properties: {
          name: { type: "string" },
          title: { type: "string" },
          description: { type: "string" },
          image: { type: "string" },
          attribute: { type: "string" },
          href: { type: "string" },
          kindID: { type: "string", format: "uuid" },
          isActive: { type: "boolean" },
        },
      },
      UpdateWebsiteSettingRequest: {
        allOf: [{ $ref: "#/components/schemas/CreateWebsiteSettingRequest" }],
      },
      CreateWebsiteSettingKindRequest: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string" },
          isActive: { type: "boolean" },
        },
      },
      CreateServiceCenterRequest: {
        type: "object",
        required: ["title"],
        properties: {
          slug: { type: "string" },
          title: { type: "string" },
          city: { type: "string" },
          tagline: { type: "string" },
          summary: { type: "string" },
          image: { type: "string" },
          primary: { type: "boolean" },
          contacts: {
            type: "array",
            items: { $ref: "#/components/schemas/ServiceCenterContact" },
          },
          services: { type: "array", items: { type: "string" } },
          isActive: { type: "boolean" },
        },
      },
      UpdateWebsiteSettingKindRequest: {
        allOf: [
          { $ref: "#/components/schemas/CreateWebsiteSettingKindRequest" },
        ],
      },
      UpdateServiceCenterRequest: {
        allOf: [{ $ref: "#/components/schemas/CreateServiceCenterRequest" }],
      },
      SlugPreviewRequest: {
        type: "object",
        required: ["model", "source"],
        properties: {
          model: {
            type: "string",
            enum: ["product", "category", "brand", "article"],
          },
          source: { type: "string" },
          excludeId: { type: "string", format: "uuid" },
        },
      },
      SlugPreviewResponse: {
        type: "object",
        properties: { slug: { type: "string" } },
      },
    },
  },
  paths: {
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login and receive JWT",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Successful login",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginResponse" },
              },
            },
          },
          401: { description: "Invalid credentials" },
        },
      },
    },
    "/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "Logout (stateless)",
        security: [{ BearerAuth: [] }],
        responses: { 200: { description: "Logged out" } },
      },
    },
    "/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Get current authenticated user",
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: "OK",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/MeResponse" },
              },
            },
          },
          401: { description: "Unauthorized" },
        },
      },
    },
    "/products": {
      get: {
        tags: ["Products"],
        summary: "List products",
        security: [{ BearerAuth: [] }],
        parameters: [
          { in: "query", name: "q", schema: { type: "string" } },
          {
            in: "query",
            name: "brandID",
            schema: { type: "string", format: "uuid" },
          },
          {
            in: "query",
            name: "categoryID",
            schema: { type: "string", format: "uuid" },
          },
          {
            in: "query",
            name: "statusID",
            schema: { type: "string", format: "uuid" },
          },
          { in: "query", name: "isActive", schema: { type: "boolean" } },
          {
            in: "query",
            name: "limit",
            schema: { type: "integer", default: 20 },
          },
          {
            in: "query",
            name: "offset",
            schema: { type: "integer", default: 0 },
          },
        ],
        responses: {
          200: {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  allOf: [{ $ref: "#/components/schemas/PageResult" }],
                  properties: {
                    items: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Product" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Products"],
        summary: "Create product",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateProductRequest" },
            },
          },
        },
        responses: { 201: { description: "Created" } },
      },
    },
    "/products/{id}": {
      get: {
        tags: ["Products"],
        summary: "Get product by id",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          200: { description: "OK" },
          404: { description: "Not Found" },
        },
      },
      put: {
        tags: ["Products"],
        summary: "Update product",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateProductRequest" },
            },
          },
        },
        responses: { 200: { description: "OK" } },
      },
      delete: {
        tags: ["Products"],
        summary: "Delete product",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          200: { description: "Deleted" },
          404: { description: "Not Found" },
        },
      },
    },
    "/public/content": {
      get: {
        tags: ["Public"],
        summary: "Public content keys",
        responses: {
          200: { description: "OK" },
        },
      },
    },
    "/public/content/{key}": {
      get: {
        tags: ["Public"],
        summary: "Public content by key",
        parameters: [
          {
            in: "path",
            name: "key",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "OK" },
          404: { description: "Not Found" },
        },
      },
    },
    "/public/products/{slug}": {
      get: {
        tags: ["Public"],
        summary: "Public product by slug",
        parameters: [
          {
            in: "path",
            name: "slug",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "OK" },
          404: { description: "Not Found" },
        },
      },
    },
    "/public/articles/{slug}": {
      get: {
        tags: ["Public"],
        summary: "Public article by slug",
        parameters: [
          {
            in: "path",
            name: "slug",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "OK" },
          404: { description: "Not Found" },
        },
      },
    },
    "/public/brands/{slug}": {
      get: {
        tags: ["Public"],
        summary: "Public brand by slug",
        parameters: [
          {
            in: "path",
            name: "slug",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "OK" },
          404: { description: "Not Found" },
        },
      },
    },
    "/public/service-centers": {
      get: {
        tags: ["Public"],
        summary: "Public service center list",
        parameters: [
          { in: "query", name: "q", schema: { type: "string" } },
          { in: "query", name: "city", schema: { type: "string" } },
          { in: "query", name: "primary", schema: { type: "boolean" } },
          { in: "query", name: "limit", schema: { type: "integer" } },
          { in: "query", name: "offset", schema: { type: "integer" } },
        ],
        responses: {
          200: { description: "OK" },
        },
      },
    },
    "/public/service-centers/{slug}": {
      get: {
        tags: ["Public"],
        summary: "Public service center by slug",
        parameters: [
          {
            in: "path",
            name: "slug",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "OK" },
          404: { description: "Not Found" },
        },
      },
    },
    "/permissions": {
      get: { tags: ["Permissions"], security: [{ BearerAuth: [] }], summary: "List permissions", responses: { 200: { description: "OK" } } },
    },
    "/roles": {
      get: { tags: ["Roles"], security: [{ BearerAuth: [] }], summary: "List roles", responses: { 200: { description: "OK" } } },
      post: { tags: ["Roles"], security: [{ BearerAuth: [] }], summary: "Create role", requestBody: { required: true }, responses: { 201: { description: "Created" } } },
    },
    "/roles/{id}": {
      get: { tags: ["Roles"], security: [{ BearerAuth: [] }], summary: "Get role", parameters: [{ in: "path", name: "id", required: true, schema: { type: "string", format: "uuid" } }], responses: { 200: { description: "OK" }, 404: { description: "Not Found" } } },
      put: { tags: ["Roles"], security: [{ BearerAuth: [] }], summary: "Update role", parameters: [{ in: "path", name: "id", required: true, schema: { type: "string", format: "uuid" } }], requestBody: { required: true }, responses: { 200: { description: "OK" } } },
      delete: { tags: ["Roles"], security: [{ BearerAuth: [] }], summary: "Delete role", parameters: [{ in: "path", name: "id", required: true, schema: { type: "string", format: "uuid" } }], responses: { 200: { description: "Deleted" }, 404: { description: "Not Found" } } },
    },
    "/roles/{id}/permissions": {
      put: { tags: ["Roles"], security: [{ BearerAuth: [] }], summary: "Set role permissions", parameters: [{ in: "path", name: "id", required: true, schema: { type: "string", format: "uuid" } }], requestBody: { required: true }, responses: { 200: { description: "OK" } } },
    },
    "/users/{id}/roles": {
      get: { tags: ["Users"], security: [{ BearerAuth: [] }], summary: "Get user roles", parameters: [{ in: "path", name: "id", required: true, schema: { type: "string", format: "uuid" } }], responses: { 200: { description: "OK" } } },
      put: { tags: ["Users"], security: [{ BearerAuth: [] }], summary: "Set user roles", parameters: [{ in: "path", name: "id", required: true, schema: { type: "string", format: "uuid" } }], requestBody: { required: true }, responses: { 200: { description: "OK" } } },
    },
    "/product-statuses": {
      get: { tags: ["ProductStatuses"], security: [{ BearerAuth: [] }], summary: "List product statuses", responses: { 200: { description: "OK" } } },
    },
    "/service-centers": {
      get: {
        tags: ["ServiceCenters"],
        security: [{ BearerAuth: [] }],
        summary: "List service centers",
        parameters: [
          { in: "query", name: "q", schema: { type: "string" } },
          { in: "query", name: "city", schema: { type: "string" } },
          { in: "query", name: "primary", schema: { type: "boolean" } },
          { in: "query", name: "isActive", schema: { type: "boolean" } },
          { in: "query", name: "limit", schema: { type: "integer" } },
          { in: "query", name: "offset", schema: { type: "integer" } },
        ],
        responses: {
          200: {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  allOf: [{ $ref: "#/components/schemas/PageResult" }],
                  properties: {
                    items: {
                      type: "array",
                      items: { $ref: "#/components/schemas/ServiceCenter" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["ServiceCenters"],
        security: [{ BearerAuth: [] }],
        summary: "Create service center",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateServiceCenterRequest" },
            },
          },
        },
        responses: { 201: { description: "Created" } },
      },
    },
    "/service-centers/{id}": {
      get: {
        tags: ["ServiceCenters"],
        security: [{ BearerAuth: [] }],
        summary: "Get service center",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "OK" },
          404: { description: "Not Found" },
        },
      },
      put: {
        tags: ["ServiceCenters"],
        security: [{ BearerAuth: [] }],
        summary: "Update service center",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateServiceCenterRequest" },
            },
          },
        },
        responses: { 200: { description: "OK" } },
      },
      delete: {
        tags: ["ServiceCenters"],
        security: [{ BearerAuth: [] }],
        summary: "Delete service center",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "Deleted" },
          404: { description: "Not Found" },
        },
      },
    },
    "/public/categories/{slug}": {
      get: {
        tags: ["Public"],
        summary: "Public category by slug",
        parameters: [
          {
            in: "path",
            name: "slug",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "OK" },
          404: { description: "Not Found" },
        },
      },
    },

    // Users
    "/users": {
      get: {
        tags: ["Users"],
        security: [{ BearerAuth: [] }],
        summary: "List users",
        parameters: [
          { in: "query", name: "limit", schema: { type: "integer" } },
          { in: "query", name: "offset", schema: { type: "integer" } },
        ],
        responses: {
          200: {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  allOf: [{ $ref: "#/components/schemas/PageResult" }],
                  properties: {
                    items: {
                      type: "array",
                      items: { $ref: "#/components/schemas/User" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Users"],
        security: [{ BearerAuth: [] }],
        summary: "Create user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateUserRequest" },
            },
          },
        },
        responses: { 201: { description: "Created" } },
      },
    },
    "/users/{id}": {
      get: { tags: ["Users"], security: [{ BearerAuth: [] }], summary: "Get user", parameters: [{ in: "path", name: "id", required: true, schema: { type: "string", format: "uuid" } }], responses: { 200: { description: "OK" }, 404: { description: "Not Found" } } },
      put: { tags: ["Users"], security: [{ BearerAuth: [] }], summary: "Update user", parameters: [{ in: "path", name: "id", required: true, schema: { type: "string", format: "uuid" } }], requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CreateUserRequest" } } } }, responses: { 200: { description: "OK" } } },
      delete: { tags: ["Users"], security: [{ BearerAuth: [] }], summary: "Delete user", parameters: [{ in: "path", name: "id", required: true, schema: { type: "string", format: "uuid" } }], responses: { 200: { description: "Deleted" }, 404: { description: "Not Found" } } },
    },

    // Categories
    "/categories": {
      get: {
        tags: ["Categories"],
        security: [{ BearerAuth: [] }],
        summary: "List categories",
        parameters: [
          { in: "query", name: "q", schema: { type: "string" } },
          {
            in: "query",
            name: "parentID",
            schema: { type: "string", format: "uuid" },
          },
          { in: "query", name: "isActive", schema: { type: "boolean" } },
          { in: "query", name: "limit", schema: { type: "integer" } },
          { in: "query", name: "offset", schema: { type: "integer" } },
        ],
        responses: {
          200: {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  allOf: [{ $ref: "#/components/schemas/PageResult" }],
                  properties: {
                    items: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Category" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Categories"],
        security: [{ BearerAuth: [] }],
        summary: "Create category",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateCategoryRequest" },
            },
          },
        },
        responses: { 201: { description: "Created" } },
      },
    },
    "/categories/{id}": {
      get: {
        tags: ["Categories"],
        security: [{ BearerAuth: [] }],
        summary: "Get category",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          200: { description: "OK" },
          404: { description: "Not Found" },
        },
      },
      put: {
        tags: ["Categories"],
        security: [{ BearerAuth: [] }],
        summary: "Update category",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateCategoryRequest" },
            },
          },
        },
        responses: { 200: { description: "OK" } },
      },
      delete: {
        tags: ["Categories"],
        security: [{ BearerAuth: [] }],
        summary: "Delete category",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          200: { description: "Deleted" },
          404: { description: "Not Found" },
        },
      },
    },

    // Brands
    "/brands": {
      get: {
        tags: ["Brands"],
        security: [{ BearerAuth: [] }],
        summary: "List brands",
        parameters: [
          { in: "query", name: "q", schema: { type: "string" } },
          { in: "query", name: "isActive", schema: { type: "boolean" } },
          { in: "query", name: "limit", schema: { type: "integer" } },
          { in: "query", name: "offset", schema: { type: "integer" } },
        ],
        responses: {
          200: {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  allOf: [{ $ref: "#/components/schemas/PageResult" }],
                  properties: {
                    items: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Brand" },
                    },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ["Brands"],
          security: [{ BearerAuth: [] }],
          summary: "Create brand",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CreateBrandRequest" },
              },
            },
          },
          responses: { 201: { description: "Created" } },
        },
      },
      "/brands/{id}": {
        get: {
          tags: ["Brands"],
          security: [{ BearerAuth: [] }],
          summary: "Get brand",
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          responses: {
            200: { description: "OK" },
            404: { description: "Not Found" },
          },
        },
        put: {
          tags: ["Brands"],
          security: [{ BearerAuth: [] }],
          summary: "Update brand",
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UpdateBrandRequest" },
              },
            },
          },
          responses: { 200: { description: "OK" } },
        },
        delete: {
          tags: ["Brands"],
          security: [{ BearerAuth: [] }],
          summary: "Delete brand",
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          responses: {
            200: { description: "Deleted" },
            404: { description: "Not Found" },
          },
        },
      },

      // Galleries
      "/products/{productId}/galleries": {
        get: {
          tags: ["Galleries"],
          security: [{ BearerAuth: [] }],
          summary: "List galleries of a product",
          parameters: [
            {
              in: "path",
              name: "productId",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          responses: { 200: { description: "OK" } },
        },
        post: {
          tags: ["Galleries"],
          security: [{ BearerAuth: [] }],
          summary: "Add gallery item to product (use /files/upload first)",
          parameters: [
            {
              in: "path",
              name: "productId",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/GalleryAddRequest" },
              },
            },
          },
          responses: { 201: { description: "Created" } },
        },
      },
      "/galleries/{id}/main": {
        patch: {
          tags: ["Galleries"],
          security: [{ BearerAuth: [] }],
          summary: "Set image as main",
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          responses: { 200: { description: "OK" } },
        },
      },
      "/galleries/{id}": {
        patch: {
          tags: ["Galleries"],
          security: [{ BearerAuth: [] }],
          summary: "Update gallery (isActive/isMain)",
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          requestBody: { required: true },
          responses: { 200: { description: "OK" } },
        },
        delete: {
          tags: ["Galleries"],
          security: [{ BearerAuth: [] }],
          summary: "Delete gallery",
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          responses: {
            200: { description: "Deleted" },
            404: { description: "Not Found" },
          },
        },
      },

      // Articles
      "/articles": {
        get: {
          tags: ["Articles"],
          security: [{ BearerAuth: [] }],
          summary: "List articles",
          parameters: [
            { in: "query", name: "articleTypeID", schema: { type: "string", format: "uuid" } },
            { in: "query", name: "q", schema: { type: "string" } },
            { in: "query", name: "isActive", schema: { type: "boolean" } },
            { in: "query", name: "limit", schema: { type: "integer" } },
            { in: "query", name: "offset", schema: { type: "integer" } },
          ],
          responses: {
            200: {
              description: "OK",
              content: {
                "application/json": {
                  schema: {
                    allOf: [{ $ref: "#/components/schemas/PageResult" }],
                    properties: {
                      items: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Article" },
                      },
                    },
                  },
                },
              },
            },
          },
          post: {
            tags: ["Articles"],
            security: [{ BearerAuth: [] }],
            summary: "Create article",
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/CreateArticleRequest" },
                },
              },
            },
            responses: { 201: { description: "Created" } },
          },
        },
        "/articles/{id}": {
          get: {
            tags: ["Articles"],
            security: [{ BearerAuth: [] }],
            summary: "Get article",
            parameters: [
              {
                in: "path",
                name: "id",
                required: true,
                schema: { type: "string", format: "uuid" },
              },
            ],
            responses: {
              200: { description: "OK" },
              404: { description: "Not Found" },
            },
          },
          put: {
            tags: ["Articles"],
            security: [{ BearerAuth: [] }],
            summary: "Update article",
            parameters: [
              {
                in: "path",
                name: "id",
                required: true,
                schema: { type: "string", format: "uuid" },
              },
            ],
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/UpdateArticleRequest" },
                },
              },
            },
            responses: { 200: { description: "OK" } },
          },
          delete: {
            tags: ["Articles"],
            security: [{ BearerAuth: [] }],
            summary: "Delete article",
            parameters: [
              {
                in: "path",
                name: "id",
                required: true,
                schema: { type: "string", format: "uuid" },
              },
            ],
            responses: {
              200: { description: "Deleted" },
              404: { description: "Not Found" },
            },
          },
        },
        "/articles/types": {
          get: {
            tags: ["Articles"],
            security: [{ BearerAuth: [] }],
            summary: "List article types",
            responses: { 200: { description: "OK" } },
          },
          post: {
            tags: ["Articles"],
            security: [{ BearerAuth: [] }],
            summary: "Create article type",
            requestBody: { required: true },
            responses: { 201: { description: "Created" } },
          },
        },
        "/articles/types/{id}": {
          put: {
            tags: ["Articles"],
            security: [{ BearerAuth: [] }],
            summary: "Update article type",
            parameters: [{ in: "path", name: "id", required: true, schema: { type: "string", format: "uuid" } }],
            requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/ArticleTypeUpsertRequest" } } } },
            responses: { 200: { description: "OK" }, 404: { description: "Not Found" } },
          },
          delete: {
            tags: ["Articles"],
            security: [{ BearerAuth: [] }],
            summary: "Delete article type",
            parameters: [{ in: "path", name: "id", required: true, schema: { type: "string", format: "uuid" } }],
            responses: { 200: { description: "Deleted" }, 404: { description: "Not Found" } },
          },
        },

        // Upload
        "/files/upload": {
          post: {
            tags: ["Upload"],
            summary: "Upload single file (returns relative path under /uploads)",
            description: "Accepts only images (jpeg,png,webp,gif,svg). Max size configurable via UPLOAD_MAX_SIZE_MB (default 10MB).",
            requestBody: {
              required: true,
              content: {
                "multipart/form-data": {
                  schema: {
                    type: "object",
                    properties: {
                      scope: { type: "string", example: "products/123" },
                      partialName: { type: "string" },
                      file: { type: "string", format: "binary" },
                    },
                  },
                },
              },
            },
            responses: {
              201: {
                description: "Uploaded",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/UploadSingleResponse",
                    },
                  },
                },
              },
            },
          },
        },
        "/files/upload/multi": {
          post: {
            tags: ["Upload"],
            summary: "Upload multiple files (returns relative paths under /uploads)",
            description: "Accepts only images (jpeg,png,webp,gif,svg). Max size configurable via UPLOAD_MAX_SIZE_MB (default 10MB).",
            requestBody: {
              required: true,
              content: {
                "multipart/form-data": {
                  schema: {
                    type: "object",
                    properties: {
                      scope: { type: "string", example: "products/123" },
                      files: {
                        type: "array",
                        items: { type: "string", format: "binary" },
                      },
                    },
                  },
                },
              },
            },
            responses: {
              201: {
                description: "Uploaded",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/UploadMultiResponse",
                    },
                  },
                },
              },
            },
          },
        },
        "/files/delete": {
          delete: {
            tags: ["Upload"],
            summary: "Delete a single file by path or scope+fileName",
            parameters: [
              { in: "query", name: "path", schema: { type: "string" } },
              { in: "query", name: "scope", schema: { type: "string" } },
              { in: "query", name: "fileName", schema: { type: "string" } },
            ],
            responses: {
              200: { description: "Deleted" },
              404: { description: "Not Found" },
            },
          },
        },
        "/files/delete-scope": {
          delete: {
            tags: ["Upload"],
            summary: "Delete a whole scope directory",
            parameters: [
              {
                in: "query",
                name: "scope",
                required: true,
                schema: { type: "string" },
              },
            ],
            responses: { 200: { description: "Scope deleted" } },
          },
        },

        // Warranty (public inquiry)
        "/warranty/inquiry/{serial}": {
          get: {
            tags: ["Warranty"],
            summary: "Public warranty inquiry by serial",
            parameters: [
              {
                in: "path",
                name: "serial",
                required: true,
                schema: { type: "string" },
              },
            ],
            responses: {
              200: { description: "OK" },
              404: { description: "Not Found" },
            },
          },
        },

        // Website Settings
        "/website-settings": {
          get: {
            tags: ["WebsiteSettings"],
            security: [{ BearerAuth: [] }],
            summary: "List website settings",
            parameters: [
              { in: "query", name: "q", schema: { type: "string" } },
              {
                in: "query",
                name: "kindID",
                schema: { type: "string", format: "uuid" },
              },
              { in: "query", name: "isActive", schema: { type: "boolean" } },
              { in: "query", name: "limit", schema: { type: "integer" } },
              { in: "query", name: "offset", schema: { type: "integer" } },
            ],
            responses: { 200: { description: "OK" } },
          },
          post: {
            tags: ["WebsiteSettings"],
            security: [{ BearerAuth: [] }],
            summary: "Create website setting",
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/CreateWebsiteSettingRequest",
                  },
                },
              },
            },
            responses: { 201: { description: "Created" } },
          },
        },
        "/website-settings/{id}": {
          get: {
            tags: ["WebsiteSettings"],
            security: [{ BearerAuth: [] }],
            summary: "Get website setting",
            parameters: [
              {
                in: "path",
                name: "id",
                required: true,
                schema: { type: "string", format: "uuid" },
              },
            ],
            responses: {
              200: { description: "OK" },
              404: { description: "Not Found" },
            },
          },
          put: {
            tags: ["WebsiteSettings"],
            security: [{ BearerAuth: [] }],
            summary: "Update website setting",
            parameters: [
              {
                in: "path",
                name: "id",
                required: true,
                schema: { type: "string", format: "uuid" },
              },
            ],
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/UpdateWebsiteSettingRequest",
                  },
                },
              },
            },
            responses: { 200: { description: "OK" } },
          },
          delete: {
            tags: ["WebsiteSettings"],
            security: [{ BearerAuth: [] }],
            summary: "Delete website setting",
            parameters: [
              {
                in: "path",
                name: "id",
                required: true,
                schema: { type: "string", format: "uuid" },
              },
            ],
            responses: {
              200: { description: "Deleted" },
              404: { description: "Not Found" },
            },
          },
        },

        // Website Setting Kinds
        "/website-setting-kinds": {
          get: {
            tags: ["WebsiteSettingKinds"],
            security: [{ BearerAuth: [] }],
            summary: "List website setting kinds",
            responses: { 200: { description: "OK" } },
          },
          post: {
            tags: ["WebsiteSettingKinds"],
            security: [{ BearerAuth: [] }],
            summary: "Create website setting kind",
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/CreateWebsiteSettingKindRequest",
                  },
                },
              },
            },
            responses: { 201: { description: "Created" } },
          },
        },
        "/website-setting-kinds/{id}": {
          get: {
            tags: ["WebsiteSettingKinds"],
            security: [{ BearerAuth: [] }],
            summary: "Get website setting kind",
            parameters: [
              {
                in: "path",
                name: "id",
                required: true,
                schema: { type: "string", format: "uuid" },
              },
            ],
            responses: {
              200: { description: "OK" },
              404: { description: "Not Found" },
            },
          },
          put: {
            tags: ["WebsiteSettingKinds"],
            security: [{ BearerAuth: [] }],
            summary: "Update website setting kind",
            parameters: [
              {
                in: "path",
                name: "id",
                required: true,
                schema: { type: "string", format: "uuid" },
              },
            ],
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/UpdateWebsiteSettingKindRequest",
                  },
                },
              },
            },
            responses: { 200: { description: "OK" } },
          },
          delete: {
            tags: ["WebsiteSettingKinds"],
            security: [{ BearerAuth: [] }],
            summary: "Delete website setting kind",
            parameters: [
              {
                in: "path",
                name: "id",
                required: true,
                schema: { type: "string", format: "uuid" },
              },
            ],
            responses: {
              200: { description: "Deleted" },
              404: { description: "Not Found" },
            },
          },
        },

        // Utils
        "/utils/slug/preview": {
          post: {
            tags: ["Utils"],
            security: [{ BearerAuth: [] }],
            summary: "Generate unique slug preview",
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/SlugPreviewRequest" },
                },
              },
            },
            responses: {
              200: {
                description: "OK",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/SlugPreviewResponse",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

module.exports = swaggerSpec;
