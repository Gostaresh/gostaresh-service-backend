"use strict";

const service = require("@/services/permission.service");

exports.list = async (req, res, next) => {
  try { const items = await service.list(); res.json(items); } catch (err) { next(err); }
};

