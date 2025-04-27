
const passport = require('passport');

// Authentication middleware
exports.protect = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
};

// Role-based access control middleware
exports.authorize = (roles) => {
  return (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    // Handle both array and single string role arguments
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    
    // Check if user has the required role
    if (!req.user.role || !allowedRoles.includes(req.user.role)) {
      console.log(`Access forbidden: User role ${req.user.role} not in allowed roles:`, allowedRoles);
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }
    
    return next();
  };
};
