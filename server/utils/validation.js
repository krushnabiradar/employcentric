
const Joi = require('joi');

// User validation
const userValidation = {
  register: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('admin', 'hr', 'employee').default('employee')
  }),
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })
};

// Leave request validation
const leaveValidation = Joi.object({
  startDate: Joi.date().required(),
  endDate: Joi.date().min(Joi.ref('startDate')).required(),
  leaveType: Joi.string().valid('sick', 'casual', 'vacation', 'other').required(),
  reason: Joi.string().required()
});

module.exports = {
  userValidation,
  leaveValidation
};
