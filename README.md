# Gostaresh Service Backend

Node.js Express REST API for Gostaresh services, built with Sequelize (MySQL), JWT auth, file uploads, and integrations. The codebase follows a modular structure with an `@` alias pointing to `src` for clean imports.

## Features
- Express 5 API with structured routes and middleware
- MySQL via Sequelize ORM, migrations and seeders
- Auth: JWT login, role/permission guards
- File uploads with Multer, static serving via `/uploads`
- Warranty API integration (configurable)
- Module path alias `@` for `src`

## Tech Stack
- Node.js 18+ (recommended)
- Express 5, Helmet, CORS, Morgan
- Sequelize 6, sequelize-cli, mysql2
- Multer for uploads
- JSON Web Tokens

## Project Structure
```
src/
  app.js                # Express app wiring
  server.js             # Server bootstrap
  routes/               # Route modules (auth, users, warranty, files)
  controllers/          # Request controllers
  services/             # Business logic & integrations
  models/               # Sequelize models and associations
  database/             # Sequelize config, migrations, seeders
  middlewares/          # Auth, errors
  utils/                # Shared helpers (file utils)
uploads/                # Static files served at /uploads (created at runtime)
```

## Getting Started

### Prerequisites
- Node.js 18+
- MySQL 8 (or compatible)

### Install
```
npm install
```

### Environment
Copy `.env.example` to `.env` and adjust values:

```
PORT=3100

# Database
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASS=
DB_NAME=gostaresh_dev
DB_NAME_TEST=gostaresh_test

JWT_SECRET=change-me
JWT_EXPIRES_IN=7d

# Warranty API integration
WARRANTY_API_BASE=https://gswapi.gscrm.ir
WARRANTY_API_TOKEN=
```

### Database: migrate and seed
```
npm run db:migrate
npm run db:seed
```
Seeders include:
- `20251020120000-seed-superadmin.js`: ensures a `superadmin` role and an `admin` user, attaches all permissions
- `20251027160000-seed-website-setting-kinds.js`: seeds website setting kinds

### Run
```
npm run dev   # nodemon
# or
npm start
```

Server listens on `PORT` (default 3100).

## Configuration Notes

### Module alias
The project uses `module-alias` with `_moduleAliases` in `package.json`:

```
"_moduleAliases": { "@": "src" }
```

Entry registers alias in `src/server.js`:

```
require("module-alias/register");
```

Use imports like:

```
const routes = require('@/routes');
const { authenticate } = require('@/middlewares/auth');
```

### Static uploads
`src/app.js` serves the `uploads` directory:

```
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
```

Any file saved under `uploads` is publicly available at `/uploads/...`.

## API Overview

Base path for the API is `/api/v1`.

### Health
- GET `/health` → `{ status, uptime }`

### Auth
- POST `/api/v1/auth/login`
  - Body: `{ "userName": string, "password": string }`
  - Response: `{ token, user }`
  - Use the token in `Authorization: Bearer <token>` header

### Users
- GET `/api/v1/users`
  - Requires: `authenticate`, permission `user.read`
- POST `/api/v1/users`
  - Requires: `authenticate`, permission `user.create`
  - Body: `{ userName, password, firstName?, lastName?, email? }`

### Files (Upload and Delete)
Mounted at `/api/v1/files`.

- POST `/upload` (multipart/form-data)
  - Fields: `file` (single file), `scope` (e.g., `products/123`), `partialName` (e.g., `image`)
  - Saves file to `uploads/<scope>/<partialName>-<timestamp>.<ext>`
  - Returns: `{ path, fileName, originalName, mimetype, size }`

- POST `/upload/multi` (multipart/form-data)
  - Fields: `files[]`, `scope`, `partialName`
  - Returns: `{ files: [ { path, fileName, ... } ] }`

- DELETE `/delete`
  - Provide either:
    - Query/body `path=/uploads/<scope>/<file>`; or
    - `scope=<scope>` and `fileName=<file>`
  - Deletes a single file only if it resides under `uploads`

- DELETE `/delete-scope`
  - Query/body: `scope=<scope>` (e.g., `products/123`)
  - Recursively deletes the scope directory under `uploads`

Example (curl):
```
curl -F "file=@./example.png" -F "scope=products/123" -F "partialName=cover" \
  http://localhost:3100/api/v1/files/upload
```

### Warranty
- GET `/api/v1/warranty/inquiry/:serial`
  - Proxies to configured Warranty API using `WARRANTY_API_TOKEN`

## Database Models (high level)
- Users, Roles, Permissions with many-to-many through tables
- Articles and Article Types
- Products, Brands, Categories, Gallery
- Warranty entities (state, provider, policy, tickets, logs)
- Website Settings
  - `website_setting_kinds` (seeded kinds)
  - `website_settings` referencing kinds by `kindID`

Migrations define FKs and helpful indexes. See `src/database/migrations/`.

## NPM Scripts
- `start` – runs `src/server.js`
- `dev` – nodemon dev mode
- `db:migrate` – run migrations
- `db:migrate:undo` – undo last migration
- `db:seed` – run all seeders
- `db:seed:undo` – undo all seeders
- `make:model` – generate model via sequelize-cli
- `make:model:uuid` – project helper for UUID model scaffold
- `make:migration` – generate migration
- `make:seed` – generate seeder

## Troubleshooting
- Cannot connect to DB: verify `.env` DB_* vars and MySQL is running
- JWT Unauthorized: ensure you pass `Authorization: Bearer <token>` after login
- Warranty integration errors: set `WARRANTY_API_TOKEN` and ensure base URL is reachable
- Uploads not accessible: check that files are saved under `uploads/` and that `/uploads` static route is mounted

## License
Proprietary – internal use for Gostaresh.

