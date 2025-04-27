const passport = require('passport');

// Combined authentication and authorization middleware
exports.protect = (roles) => {
  return (req, res, next) => {
    // First authenticate using JWT
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (err) {
        return res.status(500).json({ message: 'Internal server error' });
      }
      
      if (!user) {
        return res.status(401).json({ message: 'Unauthorized access' });
      }

      // If roles are specified, check authorization
      if (roles) {
        // Handle both array and single string role arguments
        const allowedRoles = Array.isArray(roles) ? roles : [roles];
        
        // Check if user has the required role
        if (!user.role || !allowedRoles.includes(user.role)) {
          return res.status(403).json({ 
            message: `Forbidden: Access denied. Required role(s): ${allowedRoles.join(', ')}` 
          });
        }
      }

      // Attach user to request and proceed
      req.user = user;
      next();
    })(req, res, next);
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
