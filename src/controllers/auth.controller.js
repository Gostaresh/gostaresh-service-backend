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
