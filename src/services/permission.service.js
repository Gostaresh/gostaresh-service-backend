"use strict";

const { permission } = require("@/models");

exports.list = async () => {
  return permission.findAll({ order: [["name", "ASC"]] });
};

