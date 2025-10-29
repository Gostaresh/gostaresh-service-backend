"use strict";

const Joi = require("joi");
const service = require("@/services/role.service");

const idParam = Joi.object({ id: Joi.string().uuid().required() });
const createSchema = Joi.object({ name: Joi.string().min(1).max(100).required() });
const updateSchema = createSchema.fork(["name"], (s) => s.optional());
const permsSchema = Joi.object({ permissionIDs: Joi.array().items(Joi.string().uuid()).required() });
const userRolesSchema = Joi.object({ roleIDs: Joi.array().items(Joi.string().uuid()).required() });

exports.list = async (req, res, next) => { try { res.json(await service.list()); } catch (e) { next(e); } };
exports.get = async (req, res, next) => { try { const { error } = idParam.validate(req.params); if (error) return res.status(400).json({ message: error.message }); const item = await service.get(req.params.id); if (!item) return res.status(404).json({ message: 'Not Found' }); res.json(item); } catch (e) { next(e); } };
exports.create = async (req, res, next) => { try { const { error, value } = createSchema.validate(req.body); if (error) return res.status(400).json({ message: error.message }); const created = await service.create(value); res.status(201).json(created); } catch (e) { next(e); } };
exports.update = async (req, res, next) => { try { const { error: p } = idParam.validate(req.params); if (p) return res.status(400).json({ message: p.message }); const { error, value } = updateSchema.validate(req.body); if (error) return res.status(400).json({ message: error.message }); const updated = await service.update(req.params.id, value); res.json(updated); } catch (e) { next(e); } };
exports.remove = async (req, res, next) => { try { const { error } = idParam.validate(req.params); if (error) return res.status(400).json({ message: error.message }); const n = await service.remove(req.params.id); if (!n) return res.status(404).json({ message: 'Not Found' }); res.json({ message: 'Deleted' }); } catch (e) { next(e); } };
exports.setPermissions = async (req, res, next) => { try { const { error: p } = idParam.validate(req.params); if (p) return res.status(400).json({ message: p.message }); const { error, value } = permsSchema.validate(req.body); if (error) return res.status(400).json({ message: error.message }); const out = await service.setPermissions(req.params.id, value.permissionIDs); res.json(out); } catch (e) { next(e); } };
exports.setUserRoles = async (req, res, next) => { try { const schema = Joi.object({ id: Joi.string().uuid().required() }); const { error: p } = schema.validate(req.params); if (p) return res.status(400).json({ message: p.message }); const { error, value } = userRolesSchema.validate(req.body); if (error) return res.status(400).json({ message: error.message }); await service.setUserRoles(req.params.id, value.roleIDs); res.json({ message: 'Updated' }); } catch (e) { next(e); } };

