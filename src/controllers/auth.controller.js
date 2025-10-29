"use strict";

const Joi = require("joi");
const authService = require("../services/auth.service");

const loginSchema = Joi.object({
  userName: Joi.string().min(3).max(100).required(),
  password: Joi.string().min(4).max(200).required(),
});

exports.login = async (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });
    const result = await authService.login(value.userName, value.password);
    if (!result)
      return res.status(401).json({ message: "Invalid credentials" });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

// Stateless JWT logout: client should delete token.
// Kept for symmetry and future token revocation support.
exports.logout = async (req, res, next) => {
  try {
    // If later we add token blacklist, we can revoke here using jti
    return res.json({ message: "Logged out" });
  } catch (err) {
    next(err);
  }
};

exports.me = async (req, res, next) => {
  try {
    if (!req.auth?.sub) return res.status(401).json({ message: "Unauthorized" });
    const { user } = require("@/models");
    const u = await user.findByPk(req.auth.sub, { attributes: { exclude: ["password"] } });
    res.json({ auth: { sub: req.auth.sub, roles: req.auth.roles || [], perms: Array.from(req.auth.perms || []) }, user: u });
  } catch (err) { next(err); }
};
