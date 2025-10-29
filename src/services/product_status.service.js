"use strict";

const { product_status } = require("@/models");

exports.list = async () => {
  return product_status.findAll({ order: [["createdAt", "ASC"]] });
};

