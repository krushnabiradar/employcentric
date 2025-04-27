const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Tenant = require("../models/Tenant");
const Employee = require("../models/Employee");

const seedData = async () => {
  try {
    // Create Super Admin (no tenant association)
    const superAdmin = await User.create({
      name: "Super Admin",
      email: "superadmin@employcentric.com",
      password: await bcrypt.hash("Admin@123", 10),
      role: "superadmin",
      isApproved: true,
      tenantId: null,
    });

    // --- TENANT 1 ---
    // Create Tenant 1 first with a temporary ObjectId for the admin
    const tempAdminId1 = new mongoose.Types.ObjectId();
    const tenant1 = await Tenant.create({
      name: "Tech Solutions Inc",
      company: "Tech Solutions Inc",
      email: "admin@techsolutions.com",
      phone: "+1234567890",
      address: "123 Tech Street, Silicon Valley",
      industry: "Technology",
      plan: "Enterprise",
      status: "Active",
      admin: tempAdminId1, // Temporary ID
      customization: {
        logo: "https://example.com/techsolutions-logo.png",
        primaryColor: "#2563eb",
        secondaryColor: "#1e40af",
      },
      features: {
        enableRecruiting: true,
        enablePayroll: true,
        enableAttendance: true,
        enableLeave: true,
        enablePerformance: true,
        enableTraining: true,
      },
      paymentStatus: "Paid",
    });

    // Now create the admin user with the tenant ID
    const tenant1Admin = await User.create({
      name: "John Smith",
      email: "john@techsolutions.com",
      password: await bcrypt.hash("Admin@123", 10),
      role: "admin",
      isApproved: true,
      tenantId: tenant1._id,
    });

    // Update the tenant with the real admin ID
    await Tenant.findByIdAndUpdate(tenant1._id, { admin: tenant1Admin._id });

    // Create Tenant 1 HR, Manager, and Employee
    const tenant1HR = await User.create({
      name: "Emily Davis",
      email: "emily@techsolutions.com",
      password: await bcrypt.hash("Admin@123", 10),
      role: "hr",
      tenantId: tenant1._id,
      isApproved: true,
    });

    const tenant1Manager = await User.create({
      name: "Robert Taylor",
      email: "robert@techsolutions.com",
      password: await bcrypt.hash("Admin@123", 10),
      role: "manager",
      tenantId: tenant1._id,
      isApproved: true,
    });

    const tenant1Employee = await User.create({
      name: "Alex Johnson",
      email: "alex@techsolutions.com",
      password: await bcrypt.hash("Admin@123", 10),
      role: "employee",
      tenantId: tenant1._id,
      isApproved: true,
    });

    // Create Tenant 1 Employees
    await Promise.all([
      Employee.create({
        user: tenant1Admin._id,
        tenantId: tenant1._id,
        name: "John Smith",
        email: "john@techsolutions.com",
        phone: "+1234567891",
        department: "Management",
        position: "CEO",
        salary: 150000,
        joinDate: new Date("2020-01-01"),
        status: "Active",
        company: "Tech Solutions Inc",
      }),
      Employee.create({
        user: tenant1HR._id,
        tenantId: tenant1._id,
        name: "Emily Davis",
        email: "emily@techsolutions.com",
        phone: "+1234567892",
        department: "HR",
        position: "HR Manager",
        salary: 80000,
        joinDate: new Date("2020-02-01"),
        status: "Active",
        company: "Tech Solutions Inc",
      }),
      Employee.create({
        user: tenant1Manager._id,
        tenantId: tenant1._id,
        name: "Robert Taylor",
        email: "robert@techsolutions.com",
        phone: "+1234567893",
        department: "Development",
        position: "Development Manager",
        salary: 90000,
        joinDate: new Date("2020-03-01"),
        status: "Active",
        company: "Tech Solutions Inc",
      }),
      Employee.create({
        user: tenant1Employee._id,
        tenantId: tenant1._id,
        name: "Alex Johnson",
        email: "alex@techsolutions.com",
        phone: "+1234567894",
        department: "Development",
        position: "Senior Developer",
        salary: 75000,
        joinDate: new Date("2020-04-01"),
        status: "Active",
        company: "Tech Solutions Inc",
      }),
    ]);

    // --- TENANT 2 ---
    // Create Tenant 2 first
    const tempAdminId2 = new mongoose.Types.ObjectId();
    const tenant2 = await Tenant.create({
      name: "Global Services Ltd",
      company: "Global Services Ltd",
      email: "admin@globalservices.com",
      phone: "+1987654321",
      address: "456 Business Avenue, New York",
      industry: "Consulting",
      plan: "Professional",
      status: "Active",
      admin: tempAdminId2, // Temporary ID
      customization: {
        logo: "https://example.com/globalservices-logo.png",
        primaryColor: "#059669",
        secondaryColor: "#047857",
      },
      features: {
        enableRecruiting: true,
        enablePayroll: true,
        enableAttendance: true,
        enableLeave: true,
        enablePerformance: false,
        enableTraining: false,
      },
      paymentStatus: "Paid",
    });

    // Create Tenant 2 Admin with tenantId
    const tenant2Admin = await User.create({
      name: "Sarah Johnson",
      email: "sarah@globalservices.com",
      password: await bcrypt.hash("Admin@123", 10),
      role: "admin",
      isApproved: true,
      tenantId: tenant2._id,
    });

    // Update tenant2 with the real admin ID
    await Tenant.findByIdAndUpdate(tenant2._id, { admin: tenant2Admin._id });

    // Continue with Tenant 2 users...
    const tenant2HR = await User.create({
      name: "David Wilson",
      email: "david@globalservices.com",
      password: await bcrypt.hash("Admin@123", 10),
      role: "hr",
      tenantId: tenant2._id,
      isApproved: true,
    });

    // Continue with rest of Tenant 2...
    
    // --- TENANT 3 ---
    // Same pattern for Tenant 3
    const tempAdminId3 = new mongoose.Types.ObjectId();
    const tenant3 = await Tenant.create({
      name: "Innovative Solutions",
      company: "Innovative Solutions",
      email: "admin@innovativesolutions.com",
      phone: "+1122334455",
      address: "789 Innovation Road, Boston",
      industry: "Research & Development",
      plan: "Basic",
      status: "Active",
      admin: tempAdminId3, // Temporary ID
      customization: {
        logo: "https://example.com/innovativesolutions-logo.png",
        primaryColor: "#7c3aed",
        secondaryColor: "#6d28d9",
      },
      features: {
        enableRecruiting: true,
        enablePayroll: true,
        enableAttendance: true,
        enableLeave: true,
        enablePerformance: false,
        enableTraining: false,
      },
      paymentStatus: "Paid",
    });

    // Create Tenant 3 Admin with tenantId
    const tenant3Admin = await User.create({
      name: "Michael Brown",
      email: "michael@innovativesolutions.com",
      password: await bcrypt.hash("Admin@123", 10),
      role: "admin",
      isApproved: true,
      tenantId: tenant3._id,
    });

    // Update tenant3 with the real admin ID
    await Tenant.findByIdAndUpdate(tenant3._id, { admin: tenant3Admin._id });

    // Continue with rest of Tenant 3...

    console.log("Database seeded successfully!");
    // Continue with console log messages...

  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    mongoose.connection.close();
  }
};

module.exports = seedData;