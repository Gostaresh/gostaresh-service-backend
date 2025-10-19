'use strict';

const crypto = require('crypto');
const { User } = require('../models');

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

exports.list = async () => {
  return User.findAll({ attributes: { exclude: ['passwordHash'] } });
};

exports.create = async ({ firstName, lastName, email, password }) => {
  const passwordHash = hashPassword(password);
  const user = await User.create({ firstName, lastName, email, passwordHash });
  const { passwordHash: _, ...safe } = user.get({ plain: true });
  return safe;
};

