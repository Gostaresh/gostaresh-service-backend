#!/usr/bin/env node
'use strict';

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const MIGRATIONS_DIR = path.join(ROOT, 'src', 'database', 'migrations');
const MODELS_DIR = path.join(ROOT, 'src', 'models');

function getLatestFile(dir, filterFn = () => true) {
  const files = fs
    .readdirSync(dir)
    .filter((f) => filterFn(f))
    .map((f) => ({ f, stat: fs.statSync(path.join(dir, f)) }))
    .sort((a, b) => b.stat.mtimeMs - a.stat.mtimeMs);
  return files.length ? path.join(dir, files[0].f) : null;
}

function patchMigrationToUUID(migrationPath) {
  if (!migrationPath || !fs.existsSync(migrationPath)) return false;
  let content = fs.readFileSync(migrationPath, 'utf8');
  if (/Sequelize\.UUID/.test(content)) return false; // already patched

  const idBlockRegex = /id:\s*\{[\s\S]*?\},/m;
  const newIdBlock = `id: {\n        allowNull: false,\n        primaryKey: true,\n        type: Sequelize.UUID,\n        defaultValue: Sequelize.UUIDV4,\n      },`;

  if (idBlockRegex.test(content)) {
    content = content.replace(idBlockRegex, newIdBlock);
    fs.writeFileSync(migrationPath, content, 'utf8');
    return true;
  }
  return false;
}

function patchModelToUUID(modelPath) {
  if (!modelPath || !fs.existsSync(modelPath)) return false;
  let content = fs.readFileSync(modelPath, 'utf8');
  if (/DataTypes\.UUID/.test(content)) return false; // already patched

  const initRegex = /\.init\(\{\s*/m;
  const idField = `id: {\n      type: DataTypes.UUID,\n      defaultValue: DataTypes.UUIDV4,\n      primaryKey: true,\n      allowNull: false,\n    },\n    `;

  if (initRegex.test(content)) {
    content = content.replace(initRegex, (m) => m + idField);
    fs.writeFileSync(modelPath, content, 'utf8');
    return true;
  }
  return false;
}

function run() {
  const raw = process.argv.slice(2);

  // Support both flag style and positional style on Windows/npm
  const hasFlags = raw.some((a) => a.startsWith('--'));
  let cmd = 'npx sequelize-cli model:generate ';
  if (hasFlags) {
    // Forward as-is
    cmd += raw.map((a) => (/\s/.test(a) ? `"${a}"` : a)).join(' ');
  } else {
    if (raw.length < 2) {
      console.error('Usage (positional): make:model:uuid <Name> <attr:type> [attr:type]...');
      console.error('Usage (flags): make:model:uuid -- --name <Name> --attributes "a:type,b:type"');
      process.exit(1);
    }
    const name = raw[0];
    const attributes = raw.slice(1).join(',');
    cmd += `--name ${name} --attributes ${attributes}`;
  }

  // Run sequelize-cli model:generate with constructed args
  execSync(cmd, { stdio: 'inherit' });

  // Find latest migration and model and patch them
  const latestMigration = getLatestFile(MIGRATIONS_DIR, (f) => f.endsWith('.js'));
  const latestModel = getLatestFile(MODELS_DIR, (f) => f.endsWith('.js') && f !== 'index.js');

  const migrated = patchMigrationToUUID(latestMigration);
  const modeled = patchModelToUUID(latestModel);

  // Basic stdout notes
  if (migrated) {
    console.log(`Patched migration to UUID: ${path.relative(ROOT, latestMigration)}`);
  } else {
    console.log('No migration patched (maybe already UUID or not found).');
  }
  if (modeled) {
    console.log(`Patched model to UUID: ${path.relative(ROOT, latestModel)}`);
  } else {
    console.log('No model patched (maybe already UUID or not found).');
  }
}

run();
