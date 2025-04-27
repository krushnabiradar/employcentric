const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../models/User");
const Tenant = require("../models/Tenant");
const logger = require("../utils/logger");
const Employee = require("../models/Employee");

const authController = {
  // Register a new user
  async register(req, res) {
    try {
      const { name, email, password, role, tenantId } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      // For non-superadmin users, verify tenant
      if (role !== "superadmin") {
        const tenant = await Tenant.findById(tenantId);
        if (!tenant) {
          return res.status(400).json({ error: "Invalid tenant" });
        }
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = new User({
        name,
        email,
        password: hashedPassword,
        role,
        tenantId: role !== "superadmin" ? tenantId : null,
        isActive: true,
      });

      await user.save();

      // Generate token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "24h",
      });

      res.status(201).json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          tenantId: user.tenantId,
        },
        token,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Login user
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({ error: "Account is inactive" });
      }

      // Verify password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // For non-superadmin users, verify tenant
      if (user.role !== "superadmin") {
        const tenant = await Tenant.findById(user.tenantId);
        if (!tenant || tenant.status.toLowerCase() !== "active") {
          return res.status(401).json({ error: "Tenant is inactive" });
        }
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "24h",
      });

      // Set token in both cookie and response body
      // Use res.cookie instead of manually setting header for better compatibility
      res.cookie('token', token, {
        httpOnly: true,
        path: '/',
        sameSite: 'lax', // Use 'lax' for development (works with http)
        maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
        secure: process.env.NODE_ENV === 'production', // Only secure in production
        domain: process.env.NODE_ENV === 'production' ? undefined : 'localhost'
      });

      // Log cookie settings
      console.log('Setting auth cookie with options:', {
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        maxAge: '24 hours'
      });

      // Set CORS and security headers
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Expose-Headers', 'Authorization');
      res.setHeader('Authorization', `Bearer ${token}`);

      // Log response details
      console.log("Auth response:", {
        token: token.substring(0, 10) + "...",
        headers: res.getHeaders(),
        user: {
          id: user._id,
          role: user.role
        }
      });

      let employeeId = null;
      try {
        const employeeRecord = await Employee.findOne({ user: user._id });
        if (employeeRecord) {
          employeeId = employeeRecord._id;
        }
      } catch (err) {
        console.error("Error fetching employee record:", err);
      }
      
      // Then include employeeId in your response:
      res.json({
        token, // Include token in response body
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          tenantId: user.tenantId,
          employeeId: employeeId, // <-- Add this line
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }, // <-- This closing b
  //
  //
  // // Add this to your authController object
  async logout(req, res) {
    try {
      // Clear the JWT cookie
      res.clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/"
      });
      
      console.log('Clearing auth cookie');

      // If you're tracking sessions or want to update last logout time
      if (req.user) {
        const user = await User.findById(req.user._id);
        if (user) {
          user.lastLogout = new Date();
          await user.save();
        }
      }

      // Send success response
      res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      logger.error("Logout error:", error);
      res.status(500).json({ error: "Error during logout" });
    }
  },

  // Get current user
  async getCurrentUser(req, res) {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      res.json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          tenantId: user.tenantId,
        },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update user profile
  async updateProfile(req, res) {
    try {
      const { name, email, currentPassword, newPassword } = req.body;
      const user = await User.findById(req.user._id);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Update name and email
      if (name) user.name = name;
      if (email) user.email = email;

      // Update password if provided
      if (currentPassword && newPassword) {
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
          return res
            .status(401)
            .json({ error: "Current password is incorrect" });
        }
        user.password = await bcrypt.hash(newPassword, 10);
      }

      await user.save();

      res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get all users (admin only)
  async getAllUsers(req, res) {
    try {
      const { role, tenantId } = req.query;
      const query = {};

      // Filter by role if provided
      if (role) {
        query.role = role;
      }

      // For non-superadmin users, only show users from their tenant
      if (req.user.role !== "superadmin") {
        query.tenantId = req.user.tenantId;
      } else if (tenantId) {
        // Superadmin can filter by tenant
        query.tenantId = tenantId;
      }

      const users = await User.find(query)
        .select("-password")
        .populate("tenantId", "name company status");

      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update user status (admin only)
  async updateUserStatus(req, res) {
    try {
      const { id } = req.params;
      const { isActive } = req.body;

      // Find user
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Check if user has permission to update this user
      if (
        req.user.role !== "superadmin" &&
        user.tenantId.toString() !== req.user.tenantId.toString()
      ) {
        return res
          .status(403)
          .json({ error: "Not authorized to update this user" });
      }

      // Prevent deactivating superadmin
      if (user.role === "superadmin" && !isActive) {
        return res.status(403).json({ error: "Cannot deactivate superadmin" });
      }

      user.isActive = isActive;
      await user.save();

      res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
        isActive: user.isActive,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = authController;
