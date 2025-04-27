const User = require('../models/User');
const Tenant = require('../models/Tenant');

exports.getSystemStats = async (req, res) => {
  try {
    const [totalTenants, activeUsers, pendingApprovals] = await Promise.all([
      Tenant.countDocuments(),
      User.countDocuments({ status: 'active' }),
      Tenant.countDocuments({ status: 'pending' })
    ]);

    // Calculate system uptime (mock value for now)
    const systemUptime = 99.99;

    res.json({
      totalTenants,
      activeUsers,
      systemUptime,
      pendingApprovals
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSystemAlerts = async (req, res) => {
  try {
    // Mock alerts for now - in production, these would come from a monitoring system
    const alerts = [
      {
        id: '1',
        type: 'info',
        title: 'System Update',
        message: 'New system update available',
        timestamp: new Date().toISOString()
      }
    ];
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTenantGrowth = async (req, res) => {
  try {
    // Get tenant creation dates for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const tenants = await Tenant.find({
      createdAt: { $gte: sixMonthsAgo }
    }).select('createdAt');

    // Group tenants by month
    const monthlyGrowth = {};
    tenants.forEach(tenant => {
      const month = tenant.createdAt.toLocaleString('default', { month: 'short' });
      monthlyGrowth[month] = (monthlyGrowth[month] || 0) + 1;
    });

    // Format data for the chart
    const growthData = Object.entries(monthlyGrowth).map(([name, value]) => ({
      name,
      value
    }));

    res.json(growthData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSystemUsage = async (req, res) => {
  try {
    // Get active and inactive users per tenant
    const tenants = await Tenant.find().select('name');
    const usageData = await Promise.all(
      tenants.map(async tenant => {
        const [active, inactive] = await Promise.all([
          User.countDocuments({ tenant: tenant._id, status: 'active' }),
          User.countDocuments({ tenant: tenant._id, status: 'inactive' })
        ]);
        return {
          name: tenant.name,
          active,
          inactive
        };
      })
    );

    res.json(usageData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
