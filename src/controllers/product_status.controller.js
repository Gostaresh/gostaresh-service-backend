"use strict";

const service = require("@/services/product_status.service");

exports.list = async (req, res, next) => {
  try { const items = await service.list(); res.json(items); } catch (e) { next(e); }
};

