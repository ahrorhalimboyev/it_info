const Joi = require("joi");

const adminSchema = Joi.object({
  admin_name: Joi.string().required(),
  admin_email: Joi.string().email().required(),
  admin_password: Joi.string().required().min(8),
  admin_is_active: Joi.boolean().default(true),
  admin_is_creator: Joi.boolean().default(false),
});

module.exports = adminSchema;
