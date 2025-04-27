const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Tenant = require('../models/Tenant');
require('../config/passport')(); 
// Combined authentication and authorization middleware
exports.protect = (roles) => {
  return (req, res, next) => {
    // Get token from cookie instead of Authorization header
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized access' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      User.findById(decoded.userId)
        .then(user => {
          if (!user) {
            return res.status(401).json({ message: 'Unauthorized access' });
          }

          // If roles are specified, check authorization
          if (roles) {
            const allowedRoles = Array.isArray(roles) ? roles : [roles];
            if (!user.role || !allowedRoles.includes(user.role)) {
              return res.status(403).json({ 
                message: `Forbidden: Access denied. Required role(s): ${allowedRoles.join(', ')}` 
              });
            }
          }

          req.user = user;
          next();
        })
        .catch(err => {
          console.error('Error finding user:', err);
          return res.status(401).json({ message: 'Unauthorized access' });
        });
    } catch (err) {
      return res.status(401).json({ message: 'Unauthorized access' });
    }
  };
};

// Validation middleware
exports.validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    next();
  };
};

// Authentication middleware
exports.auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded.userId, isActive: true });

    if (!user) {
      throw new Error('User not found or inactive');
    }

    // For non-superadmin users, verify tenant access
    if (user.role !== 'superadmin') {
      const tenant = await Tenant.findById(user.tenantId);
      if (!tenant || tenant.status !== 'active') {
        throw new Error('Tenant not found or inactive');
      }
      req.tenant = tenant;
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

// Role-based access control middleware
exports.checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    next();
  };
};

// Tenant-specific middleware
exports.checkTenantAccess = async (req, res, next) => {
  try {
    if (req.user.role === 'superadmin') {
      return next();
    }

    const tenantId = req.params.tenantId || req.body.tenantId;
    if (!tenantId) {
      return res.status(400).json({ error: 'Tenant ID required' });
    }

    if (req.user.tenantId.toString() !== tenantId.toString()) {
      return res.status(403).json({ error: 'Access denied to this tenant' });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};