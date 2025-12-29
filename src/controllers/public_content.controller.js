"use strict";

const service = require("@/services/public_content.service");
const serviceCenterService = require("@/services/service_center.service");

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

exports.serviceCenterList = async (req, res, next) => {
  try {
    const { q, city, primary, limit, offset } = req.query;
    const result = await serviceCenterService.list({
      q,
      city,
      primary:
        typeof primary === "undefined"
          ? undefined
          : primary === "true" || primary === true,
      isActive: true,
      limit,
      offset,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
};
