const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Tenant = require('../models/Tenant');
const Employee = require('../models/Employee');

const seedData = async () => {
  try {
    // Create Super Admin (no tenant association)
    const superAdmin = await User.create({
      name: 'Super Admin',
      email: 'superadmin@employcentric.com',
      password: await bcrypt.hash('Admin@123', 10),
      role: 'superadmin',
      isApproved: true
    });

    // Create Tenant 1 (Tech Solutions Inc)
    const tenant1Admin = await User.create({
      name: 'John Smith',
      email: 'john@techsolutions.com',
      password: await bcrypt.hash('Tech@123', 10),
      role: 'admin',
      isApproved: true
    });

    const tenant1 = await Tenant.create({
      name: 'Tech Solutions Inc',
      company: 'Tech Solutions Inc',
      email: 'admin@techsolutions.com',
      phone: '+1234567890',
      address: '123 Tech Street, Silicon Valley',
      industry: 'Technology',
      plan: 'Enterprise',
      status: 'Active',
      admin: tenant1Admin._id,
      customization: {
        logo: 'https://example.com/techsolutions-logo.png',
        primaryColor: '#2563eb',
        secondaryColor: '#1e40af'
      },
      features: {
        enableRecruiting: true,
        enablePayroll: true,
        enableAttendance: true,
        enableLeave: true,
        enablePerformance: true,
        enableTraining: true
      },
      paymentStatus: 'Paid'
    });

    // Update tenant1 admin with tenantId
    await User.findByIdAndUpdate(tenant1Admin._id, { tenantId: tenant1._id });

    // Create Tenant 1 HR
    const tenant1HR = await User.create({
      name: 'Emily Davis',
      email: 'emily@techsolutions.com',
      password: await bcrypt.hash('HR@123', 10),
      role: 'hr',
      tenantId: tenant1._id,
      isApproved: true
    });

    // Create Tenant 1 Manager
    const tenant1Manager = await User.create({
      name: 'Robert Taylor',
      email: 'robert@techsolutions.com',
      password: await bcrypt.hash('Manager@123', 10),
      role: 'manager',
      tenantId: tenant1._id,
      isApproved: true
    });

    // Create Tenant 1 Employee
    const tenant1Employee = await User.create({
      name: 'Alex Johnson',
      email: 'alex@techsolutions.com',
      password: await bcrypt.hash('Employee@123', 10),
      role: 'employee',
      tenantId: tenant1._id,
      isApproved: true
    });

    // Create Tenant 1 Employees
    await Promise.all([
      Employee.create({
        user: tenant1Admin._id,
        tenantId: tenant1._id,
        name: 'John Smith',
        email: 'john@techsolutions.com',
        phone: '+1234567891',
        department: 'Management',
        position: 'CEO',
        salary: 150000,
        joinDate: new Date('2020-01-01'),
        status: 'Active',
        company: 'Tech Solutions Inc'
      }),
      Employee.create({
        user: tenant1HR._id,
        tenantId: tenant1._id,
        name: 'Emily Davis',
        email: 'emily@techsolutions.com',
        phone: '+1234567892',
        department: 'HR',
        position: 'HR Manager',
        salary: 80000,
        joinDate: new Date('2020-02-01'),
        status: 'Active',
        company: 'Tech Solutions Inc'
      }),
      Employee.create({
        user: tenant1Manager._id,
        tenantId: tenant1._id,
        name: 'Robert Taylor',
        email: 'robert@techsolutions.com',
        phone: '+1234567893',
        department: 'Development',
        position: 'Development Manager',
        salary: 90000,
        joinDate: new Date('2020-03-01'),
        status: 'Active',
        company: 'Tech Solutions Inc'
      }),
      Employee.create({
        user: tenant1Employee._id,
        tenantId: tenant1._id,
        name: 'Alex Johnson',
        email: 'alex@techsolutions.com',
        phone: '+1234567894',
        department: 'Development',
        position: 'Senior Developer',
        salary: 75000,
        joinDate: new Date('2020-04-01'),
        status: 'Active',
        company: 'Tech Solutions Inc'
      })
    ]);

    // Create Tenant 2 (Global Services Ltd)
    const tenant2Admin = await User.create({
      name: 'Sarah Johnson',
      email: 'sarah@globalservices.com',
      password: await bcrypt.hash('Global@123', 10),
      role: 'admin',
      isApproved: true
    });

    const tenant2 = await Tenant.create({
      name: 'Global Services Ltd',
      company: 'Global Services Ltd',
      email: 'admin@globalservices.com',
      phone: '+1987654321',
      address: '456 Business Avenue, New York',
      industry: 'Consulting',
      plan: 'Professional',
      status: 'Active',
      admin: tenant2Admin._id,
      customization: {
        logo: 'https://example.com/globalservices-logo.png',
        primaryColor: '#059669',
        secondaryColor: '#047857'
      },
      features: {
        enableRecruiting: true,
        enablePayroll: true,
        enableAttendance: true,
        enableLeave: true,
        enablePerformance: false,
        enableTraining: false
      },
      paymentStatus: 'Paid'
    });

    // Update tenant2 admin with tenantId
    await User.findByIdAndUpdate(tenant2Admin._id, { tenantId: tenant2._id });

    // Create Tenant 2 HR
    const tenant2HR = await User.create({
      name: 'David Wilson',
      email: 'david@globalservices.com',
      password: await bcrypt.hash('HR@123', 10),
      role: 'hr',
      tenantId: tenant2._id,
      isApproved: true
    });

    // Create Tenant 2 Manager
    const tenant2Manager = await User.create({
      name: 'Jennifer Lee',
      email: 'jennifer@globalservices.com',
      password: await bcrypt.hash('Manager@123', 10),
      role: 'manager',
      tenantId: tenant2._id,
      isApproved: true
    });

    // Create Tenant 2 Employee
    const tenant2Employee = await User.create({
      name: 'Maria Garcia',
      email: 'maria@globalservices.com',
      password: await bcrypt.hash('Employee@123', 10),
      role: 'employee',
      tenantId: tenant2._id,
      isApproved: true
    });

    // Create Tenant 2 Employees
    await Promise.all([
      Employee.create({
        user: tenant2Admin._id,
        tenantId: tenant2._id,
        name: 'Sarah Johnson',
        email: 'sarah@globalservices.com',
        phone: '+1987654322',
        department: 'Management',
        position: 'CEO',
        salary: 140000,
        joinDate: new Date('2019-01-01'),
        status: 'Active',
        company: 'Global Services Ltd'
      }),
      Employee.create({
        user: tenant2HR._id,
        tenantId: tenant2._id,
        name: 'David Wilson',
        email: 'david@globalservices.com',
        phone: '+1987654323',
        department: 'HR',
        position: 'HR Manager',
        salary: 75000,
        joinDate: new Date('2019-02-01'),
        status: 'Active',
        company: 'Global Services Ltd'
      }),
      Employee.create({
        user: tenant2Manager._id,
        tenantId: tenant2._id,
        name: 'Jennifer Lee',
        email: 'jennifer@globalservices.com',
        phone: '+1987654324',
        department: 'Marketing',
        position: 'Marketing Manager',
        salary: 85000,
        joinDate: new Date('2019-03-01'),
        status: 'Active',
        company: 'Global Services Ltd'
      }),
      Employee.create({
        user: tenant2Employee._id,
        tenantId: tenant2._id,
        name: 'Maria Garcia',
        email: 'maria@globalservices.com',
        phone: '+1987654325',
        department: 'Marketing',
        position: 'Marketing Specialist',
        salary: 65000,
        joinDate: new Date('2019-04-01'),
        status: 'Active',
        company: 'Global Services Ltd'
      })
    ]);

    // Create Tenant 3 (Innovative Solutions)
    const tenant3Admin = await User.create({
      name: 'Michael Brown',
      email: 'michael@innovativesolutions.com',
      password: await bcrypt.hash('Innovate@123', 10),
      role: 'admin',
      isApproved: true
    });

    const tenant3 = await Tenant.create({
      name: 'Innovative Solutions',
      company: 'Innovative Solutions',
      email: 'admin@innovativesolutions.com',
      phone: '+1122334455',
      address: '789 Innovation Road, Boston',
      industry: 'Research & Development',
      plan: 'Basic',
      status: 'Active',
      admin: tenant3Admin._id,
      customization: {
        logo: 'https://example.com/innovativesolutions-logo.png',
        primaryColor: '#7c3aed',
        secondaryColor: '#6d28d9'
      },
      features: {
        enableRecruiting: true,
        enablePayroll: true,
        enableAttendance: true,
        enableLeave: true,
        enablePerformance: false,
        enableTraining: false
      },
      paymentStatus: 'Paid'
    });

    // Update tenant3 admin with tenantId
    await User.findByIdAndUpdate(tenant3Admin._id, { tenantId: tenant3._id });

    // Create Tenant 3 HR
    const tenant3HR = await User.create({
      name: 'Lisa Anderson',
      email: 'lisa@innovativesolutions.com',
      password: await bcrypt.hash('HR@123', 10),
      role: 'hr',
      tenantId: tenant3._id,
      isApproved: true
    });

    // Create Tenant 3 Manager
    const tenant3Manager = await User.create({
      name: 'James Wilson',
      email: 'james@innovativesolutions.com',
      password: await bcrypt.hash('Manager@123', 10),
      role: 'manager',
      tenantId: tenant3._id,
      isApproved: true
    });

    // Create Tenant 3 Employee
    const tenant3Employee = await User.create({
      name: 'Thomas Chen',
      email: 'thomas@innovativesolutions.com',
      password: await bcrypt.hash('Employee@123', 10),
      role: 'employee',
      tenantId: tenant3._id,
      isApproved: true
    });

    // Create Tenant 3 Employees
    await Promise.all([
      Employee.create({
        user: tenant3Admin._id,
        tenantId: tenant3._id,
        name: 'Michael Brown',
        email: 'michael@innovativesolutions.com',
        phone: '+1122334456',
        department: 'Management',
        position: 'CEO',
        salary: 130000,
        joinDate: new Date('2021-01-01'),
        status: 'Active',
        company: 'Innovative Solutions'
      }),
      Employee.create({
        user: tenant3HR._id,
        tenantId: tenant3._id,
        name: 'Lisa Anderson',
        email: 'lisa@innovativesolutions.com',
        phone: '+1122334457',
        department: 'HR',
        position: 'HR Manager',
        salary: 70000,
        joinDate: new Date('2021-02-01'),
        status: 'Active',
        company: 'Innovative Solutions'
      }),
      Employee.create({
        user: tenant3Manager._id,
        tenantId: tenant3._id,
        name: 'James Wilson',
        email: 'james@innovativesolutions.com',
        phone: '+1122334458',
        department: 'Sales',
        position: 'Sales Manager',
        salary: 80000,
        joinDate: new Date('2021-03-01'),
        status: 'Active',
        company: 'Innovative Solutions'
      }),
      Employee.create({
        user: tenant3Employee._id,
        tenantId: tenant3._id,
        name: 'Thomas Chen',
        email: 'thomas@innovativesolutions.com',
        phone: '+1122334459',
        department: 'Sales',
        position: 'Sales Representative',
        salary: 60000,
        joinDate: new Date('2021-04-01'),
        status: 'Active',
        company: 'Innovative Solutions'
      })
    ]);

    console.log('Database seeded successfully!');
    console.log('Super Admin credentials:');
    console.log('Email: superadmin@employcentric.com');
    console.log('Password: Admin@123');

    console.log('\nTenant 1 (Tech Solutions Inc) credentials:');
    console.log('Admin - Email: john@techsolutions.com, Password: Tech@123');
    console.log('HR - Email: emily@techsolutions.com, Password: HR@123');
    console.log('Manager - Email: robert@techsolutions.com, Password: Manager@123');
    console.log('Employee - Email: alex@techsolutions.com, Password: Employee@123');

    console.log('\nTenant 2 (Global Services Ltd) credentials:');
    console.log('Admin - Email: sarah@globalservices.com, Password: Global@123');
    console.log('HR - Email: david@globalservices.com, Password: HR@123');
    console.log('Manager - Email: jennifer@globalservices.com, Password: Manager@123');
    console.log('Employee - Email: maria@globalservices.com, Password: Employee@123');

    console.log('\nTenant 3 (Innovative Solutions) credentials:');
    console.log('Admin - Email: michael@innovativesolutions.com, Password: Innovate@123');
    console.log('HR - Email: lisa@innovativesolutions.com, Password: HR@123');
    console.log('Manager - Email: james@innovativesolutions.com, Password: Manager@123');
    console.log('Employee - Email: thomas@innovativesolutions.com, Password: Employee@123');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
};

module.exports = seedData; 