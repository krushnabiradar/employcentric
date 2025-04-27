const User = require('../models/User');
const Tenant = require('../models/Tenant');
const Employee = require('../models/Employee');

// Get all tenants
exports.getAllTenants = async (req, res) => {
  try {
    const tenants = await Tenant.find()
      .populate('admin', 'name email')
      .sort({ createdAt: -1 });
    res.json(tenants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get tenant by ID
exports.getTenantById = async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id)
      .populate('admin', 'name email');
    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }
    res.json(tenant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new tenant
exports.createTenant = async (req, res) => {
  try {
    const { name, company, email, phone, address, industry, plan } = req.body;
    
    // Create admin user for the tenant
    const adminUser = new User({
      name: req.body.adminName,
      email: req.body.adminEmail,
      password: req.body.adminPassword,
      role: 'admin',
      company: company,
      isApproved: true
    });
    await adminUser.save();

    // Create tenant
    const tenant = new Tenant({
      name,
      company,
      email,
      phone,
      address,
      industry,
      plan,
      admin: adminUser._id,
      status: 'Active'
    });
    await tenant.save();

    res.status(201).json(tenant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update tenant
exports.updateTenant = async (req, res) => {
  try {
    const tenant = await Tenant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }
    res.json(tenant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete tenant
exports.deleteTenant = async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id);
    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    // Delete associated admin user
    await User.findByIdAndDelete(tenant.admin);

    // Delete tenant
    await Tenant.findByIdAndDelete(req.params.id);

    res.json({ message: 'Tenant deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get tenant statistics
exports.getTenantStats = async (req, res) => {
  try {
    const totalTenants = await Tenant.countDocuments();
    const activeTenants = await Tenant.countDocuments({ status: 'Active' });
    const pendingTenants = await Tenant.countDocuments({ status: 'Pending' });
    const suspendedTenants = await Tenant.countDocuments({ status: 'Suspended' });

    res.json({
      totalTenants,
      activeTenants,
      pendingTenants,
      suspendedTenants
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all users across all tenants
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 