const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Tenant = require('../models/Tenant');
require('../config/passport')(); 

const Joi = require('joi');

// Validation schema for token
const tokenSchema = Joi.string().required().messages({
  'string.empty': 'Token is required',
  'any.required': 'Token is required'
});

// Helper function to extract token from request
const extractToken = (req) => {
  // First try Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Check for custom X-Auth-Token header
  if (req.headers['x-auth-token']) {
    return req.headers['x-auth-token'];
  }

  // Then try cookie - check both req.cookies and req.headers.cookie
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }
  
  // Fallback to parsing cookie header manually
  const cookieHeader = req.headers.cookie;
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = value;
      return acc;
    }, {});
    
    if (cookies.token) {
      return cookies.token;
    }
  }
  
  // Log cookie information for debugging
  console.log('Cookie extraction debug:', {
    hasCookieHeader: !!req.headers.cookie,
    cookieHeader: req.headers.cookie,
    hasCookiesObj: !!req.cookies,
    cookies: req.cookies,
    hasAuthHeader: !!req.headers.authorization,
    hasXAuthToken: !!req.headers['x-auth-token']
  });

  return null;
};

// Combined authentication and authorization middleware
exports.protect = (roles) => {
  return async (req, res, next) => {
    try {
      // Get token from request
      let token = extractToken(req);
      
      // If no token found, check if we have an Authorization header in the response
      if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.substring(7);
      }
      
      // If still no token, check if token is in the request body (for testing/development)
      if (!token && req.body && req.body.token) {
        token = req.body.token;
      }
      
      console.log('Token sources checked:', {
        fromExtract: !!extractToken(req),
        fromAuthHeader: !!(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')),
        fromBody: !!(req.body && req.body.token),
        finalToken: token ? token.substring(0, 10) + '...' : 'none'
      });

      // Validate token
      if (!token) {
        return res.status(401).json({ message: 'No authentication token found' });
      }
      
      try {
        await tokenSchema.validateAsync(token);
      } catch (validationError) {
        console.error('Token validation failed:', validationError.message);
        return res.status(401).json({ message: validationError.message });
      }

      // Log authentication attempt
      console.log('Authentication attempt:', {
        token: token ? token.substring(0, 10) + '...' : 'none',
        method: req.method,
        path: req.path
      });

      // Verify the token
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (jwtError) {
        console.error('JWT verification failed:', jwtError.message);
        return res.status(401).json({ message: 'Invalid or expired token' });
      }
      
      // Find user and check if active
      const user = await User.findOne({ _id: decoded.userId, isActive: true });
      if (!user) {
        console.error(`User not found or inactive: ${decoded.userId}`);
        return res.status(401).json({ message: 'User not found or inactive' });
      }

      // Check roles if specified
      if (roles) {
        const allowedRoles = Array.isArray(roles) ? roles : [roles];
        console.log('Checking roles:', {
          userRole: user.role,
          requiredRoles: allowedRoles,
          hasRequiredRole: allowedRoles.includes(user.role)
        });
        
        if (!user.role) {
          console.error('User has no role assigned');
          return res.status(403).json({ message: 'Access denied: No role assigned' });
        }
        
        if (!allowedRoles.includes(user.role)) {
          console.error(`Role check failed. User role: ${user.role}, Required roles: ${allowedRoles.join(', ')}`);
          return res.status(403).json({ 
            message: `Access denied. Required role(s): ${allowedRoles.join(', ')}` 
          });
        }
        
        console.log(`Role check passed: ${user.role}`);
      }

      // For non-superadmin users, verify tenant access
      if (user.role !== 'superadmin' && user.tenantId) {
        const tenant = await Tenant.findById(user.tenantId);
        if (!tenant || tenant.status.toLowerCase() !== 'active') {
          console.error(`Tenant check failed. Tenant ID: ${user.tenantId}`);
          return res.status(403).json({ message: 'Tenant not found or inactive' });
        }
        req.tenant = tenant;
      }

      // Log successful authentication
      console.log(`User authenticated - ID: ${user._id}, Role: ${user.role}`);
      
      req.user = user;
      next();
    } catch (err) {
      console.error('Authentication error:', err);
      return res.status(401).json({ message: 'Invalid or expired token' });
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
    let token;
    if (req.headers.cookie) {
      const cookies = req.headers.cookie.split(';');
      const tokenCookie = cookies.find(c => c.trim().startsWith('token='));
      if (tokenCookie) {
        token = tokenCookie.split('=')[1];
      }
    }
    
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