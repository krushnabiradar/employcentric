
const passport = require('passport');
const User = require('../models/User');
const logger = require('../utils/logger');

// Register new user
const register = async (req, res) => {
  try {
    const { name, email, password, role, company, phone } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Prevent registering as superadmin - superadmins can only be created by another superadmin
    let userRole = role;
    if (role === 'superadmin') {
      userRole = 'admin'; // Default to admin if someone tries to register as superadmin
    }
    
    // Create new user
    const user = new User({
      name,
      email,
      password,
      role: userRole,
      company,
      phone
    });
    
    await user.save();
    
    // Return user without password
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      company: user.company
    };
    
    res.status(201).json({ 
      user: userResponse,
      message: 'Account request submitted successfully' 
    });
  } catch (error) {
    logger.error(`Registration error: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login user
const login = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      logger.error(`Login error: ${err.message}`);
      return next(err);
    }
    if (!user) {
      return res.status(400).json({ message: info.message || 'Invalid credentials' });
    }
    req.logIn(user, (err) => {
      if (err) {
        logger.error(`Session login error: ${err.message}`);
        return next(err);
      }
      // Remove password from response
      const userResponse = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      };
      return res.status(200).json({ user: userResponse });
    });
  })(req, res, next);
};

// Logout user
const logout = (req, res) => {
  req.logout(function(err) {
    if (err) { 
      logger.error(`Logout error: ${err.message}`);
      return res.status(500).json({ message: 'Logout failed' }); 
    }
    res.status(200).json({ message: 'Logged out successfully' });
  });
};

// Get current user
const getCurrentUser = (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  const userResponse = {
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role
  };
  
  res.json({ user: userResponse });
};

module.exports = {
  register,
  login,
  logout,
  getCurrentUser
};
