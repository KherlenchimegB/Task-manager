import Joi from "joi";

// Middleware factory for validating request data
export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({
        error: "Validation Error",
        message: error.details[0].message,
        details: error.details,
      });
    }

    next();
  };
};

// Validation schemas
export const schemas = {
  // User registration validation
  register: Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
    }),
    password: Joi.string().min(6).required().messages({
      "string.min": "Password must be at least 6 characters long",
      "any.required": "Password is required",
    }),
    name: Joi.string().optional().allow(""),
  }),

  // User login validation
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  // Project creation/update validation
  project: Joi.object({
    name: Joi.string().min(1).max(100).required().messages({
      "string.min": "Project name cannot be empty",
      "string.max": "Project name cannot exceed 100 characters",
      "any.required": "Project name is required",
    }),
    description: Joi.string().max(500).optional().allow(""),
    color: Joi.string()
      .pattern(/^#[0-9A-F]{6}$/i)
      .optional(),
  }),

  // Task creation/update validation
  task: Joi.object({
    title: Joi.string().min(1).max(200).required().messages({
      "string.min": "Task title cannot be empty",
      "string.max": "Task title cannot exceed 200 characters",
      "any.required": "Task title is required",
    }),
    description: Joi.string().max(1000).optional().allow(""),
    completed: Joi.boolean().optional(),
    priority: Joi.string().valid("low", "medium", "high").optional(),
    dueDate: Joi.date().iso().optional().allow(null),
  }),
};
