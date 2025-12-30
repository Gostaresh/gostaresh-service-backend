"use strict";

const service = require("@/services/public_content.service");

exports.list = async (_req, res, next) => {
  try {
    res.json({ keys: service.listKeys() });
  } catch (err) {
    next(err);
  }
};

exports.get = async (req, res, next) => {
  try {
    const key = service.normalizeKey(req.params.key);
    const data = service.loadJsonForKey(key);
    if (!data) return res.status(404).json({ message: "Not Found" });
    res.json(data);
  } catch (err) {
    next(err);
  }
};
