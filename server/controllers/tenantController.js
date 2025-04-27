
const Tenant = require('../models/Tenant');
const User = require('../models/User');
const logger = require('../utils/logger');
const bcrypt = require('bcryptjs');

// Get all tenants
const getTenants = async (req, res) => {
  try {
    const tenants = await Tenant.find().select('-__v').populate({
      path: 'admin',
      select: 'name email role'
    });
    res.status(200).json(tenants);
  } catch (error) {
    logger.error(`Error fetching tenants: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get tenant by ID
const getTenantById = async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id).populate({
      path: 'admin',
      select: 'name email role'
    });
    
    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }
    
    res.status(200).json(tenant);
  } catch (error) {
    logger.error(`Error fetching tenant: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new tenant
const createTenant = async (req, res) => {
  try {
    const { 
      name, 
      company, 
      email, 
      phone, 
      plan, 
      address, 
      industry,
      adminName,
      adminEmail,
      adminPassword
    } = req.body;
    
    // Check if tenant with this email already exists
    const tenantExists = await Tenant.findOne({ email });
    if (tenantExists) {
      return res.status(400).json({ message: 'Tenant with this email already exists' });
    }
    
    // Check if admin user already exists
    const adminExists = await User.findOne({ email: adminEmail });
    if (adminExists) {
      return res.status(400).json({ message: 'Admin user with this email already exists' });
    }
    
    // Create admin user
    const admin = new User({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
      company: company,
      phone: phone,
      isApproved: true
    });
    
    await admin.save();
    
    // Create new tenant
    const tenant = new Tenant({
      name,
      company,
      email,
      phone,
      plan,
      address,
      industry,
      admin: admin._id,
      status: 'Active'
    });
    
    await tenant.save();
    
    // Update admin user with tenant reference
    admin.tenant = tenant._id;
    await admin.save();
    
    res.status(201).json({
      tenant: {
        id: tenant._id,
        name: tenant.name,
        company: tenant.company,
        email: tenant.email,
        status: tenant.status,
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email
        }
      }
    });
  } catch (error) {
    logger.error(`Error creating tenant: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update tenant
const updateTenant = async (req, res) => {
  try {
    const {
      name,
      company,
      email,
      phone,
      plan,
      address,
      industry,
      status
    } = req.body;
    
    const tenant = await Tenant.findById(req.params.id);
    
    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }
    
    // Update fields if provided
    if (name) tenant.name = name;
    if (company) tenant.company = company;
    if (email) tenant.email = email;
    if (phone) tenant.phone = phone;
    if (plan) tenant.plan = plan;
    if (address) tenant.address = address;
    if (industry) tenant.industry = industry;
    if (status) tenant.status = status;
    
    await tenant.save();
    
    res.status(200).json({
      id: tenant._id,
      name: tenant.name,
      company: tenant.company,
      email: tenant.email,
      status: tenant.status
    });
  } catch (error) {
    logger.error(`Error updating tenant: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// Activate tenant
const activateTenant = async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id);
    
    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }
    
    tenant.status = 'Active';
    await tenant.save();
    
    // Activate all users associated with this tenant
    await User.updateMany(
      { tenant: tenant._id },
      { isApproved: true }
    );
    
    res.status(200).json({
      id: tenant._id,
      status: tenant.status,
      message: 'Tenant activated successfully'
    });
  } catch (error) {
    logger.error(`Error activating tenant: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// Suspend tenant
const suspendTenant = async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id);
    
    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }
    
    tenant.status = 'Suspended';
    await tenant.save();
    
    // Suspend all users associated with this tenant except superadmins
    await User.updateMany(
      { tenant: tenant._id, role: { $ne: 'superadmin' } },
      { isApproved: false }
    );
    
    res.status(200).json({
      id: tenant._id,
      status: tenant.status,
      message: 'Tenant suspended successfully'
    });
  } catch (error) {
    logger.error(`Error suspending tenant: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete tenant
const deleteTenant = async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id);
    
    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }
    
    // Delete all users associated with this tenant except superadmins
    await User.deleteMany({ tenant: tenant._id, role: { $ne: 'superadmin' } });
    
    // Delete the tenant
    await Tenant.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ message: 'Tenant deleted successfully' });
  } catch (error) {
    logger.error(`Error deleting tenant: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get users for a tenant
const getTenantUsers = async (req, res) => {
  try {
    const users = await User.find({ tenant: req.params.id })
      .select('-password -__v')
      .sort({ createdAt: -1 });
    
    res.status(200).json(users);
  } catch (error) {
    logger.error(`Error fetching tenant users: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add user to tenant
const addTenantUser = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;
    const tenantId = req.params.id;
    
    // Check if tenant exists
    const tenant = await Tenant.findById(tenantId);
    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }
    
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    
    // Create new user
    const user = new User({
      name,
      email,
      password,
      role,
      phone,
      company: tenant.company,
      tenant: tenant._id,
      isApproved: true
    });
    
    await user.save();
    
    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    logger.error(`Error adding tenant user: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get pending tenant approval requests
const getPendingTenantRequests = async (req, res) => {
  try {
    // Find users that are not approved and created a tenant registration
    const pendingRequests = await User.find({ 
      isApproved: false,
      role: 'admin'  // Only admins can create tenant registrations
    }).select('-password -__v');
    
    res.status(200).json(pendingRequests);
  } catch (error) {
    logger.error(`Error fetching pending tenant requests: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// Approve tenant registration
const approveTenantRequest = async (req, res) => {
  try {
    const { userId, plan } = req.body;
    
    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Create tenant record
    const tenant = new Tenant({
      name: user.company || `${user.name}'s Organization`,
      company: user.company || `${user.name}'s Organization`,
      email: user.email,
      phone: user.phone,
      plan: plan || 'Basic',
      admin: user._id,
      status: 'Active'
    });
    
    await tenant.save();
    
    // Update user
    user.isApproved = true;
    user.tenant = tenant._id;
    await user.save();
    
    res.status(200).json({
      message: 'Tenant registration approved successfully',
      tenant: {
        id: tenant._id,
        name: tenant.name,
        status: tenant.status
      }
    });
  } catch (error) {
    logger.error(`Error approving tenant request: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// Reject tenant registration
const rejectTenantRequest = async (req, res) => {
  try {
    const { userId, reason } = req.body;
    
    // Find and delete the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Log the rejection
    logger.info(`Tenant registration rejected for ${user.email}. Reason: ${reason || 'Not specified'}`);
    
    // Delete the user
    await User.findByIdAndDelete(userId);
    
    res.status(200).json({
      message: 'Tenant registration rejected successfully'
    });
  } catch (error) {
    logger.error(`Error rejecting tenant request: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getTenants,
  getTenantById,
  createTenant,
  updateTenant,
  activateTenant,
  suspendTenant,
  deleteTenant,
  getTenantUsers,
  addTenantUser,
  getPendingTenantRequests,
  approveTenantRequest,
  rejectTenantRequest
};
