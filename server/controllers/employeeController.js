const Employee = require('../models/Employee');
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const Leave = require('../models/Leave');
const Payroll = require('../models/Payroll');

// Get all employees
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().populate('user', 'email role isApproved');
    res.status(200).json({ success: true, data: employees });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get a single employee
exports.getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).populate('user', 'email role isApproved');
    
    if (!employee) {
      return res.status(404).json({ success: false, error: 'Employee not found' });
    }
    res.status(200).json({ success: true, data: employee });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create a new employee
exports.createEmployee = async (req, res) => {
  try {
    // Check if req.body.user is provided (it should be the user ID)
    if (!req.body.user) {
      return res.status(400).json({ 
        success: false, 
        error: 'User reference is required to create an employee' 
      });
    }

    // Check if the referenced user exists
    const userExists = await User.findById(req.body.user);
    if (!userExists) {
      return res.status(400).json({ 
        success: false, 
        error: 'Referenced user does not exist' 
      });
    }

    const employee = await Employee.create(req.body);
    res.status(201).json({ success: true, data: employee });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Update an employee
exports.updateEmployee = async (req, res) => {
  try {
    // If trying to update the user reference, verify the user exists
    if (req.body.user) {
      const userExists = await User.findById(req.body.user);
      if (!userExists) {
        return res.status(400).json({ 
          success: false, 
          error: 'Referenced user does not exist' 
        });
      }
    }
    
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('user', 'email role isApproved');
    
    if (!employee) {
      return res.status(404).json({ success: false, error: 'Employee not found' });
    }
    res.status(200).json({ success: true, data: employee });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Delete an employee
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, error: 'Employee not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get employee statistics
exports.getEmployeeStats = async (req, res) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    // Get total employees count
    const totalEmployees = await Employee.countDocuments();

    // Get employees by department
    const employeesByDepartment = await Employee.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } }
    ]);

    // Get employees by role
    const employeesByRole = await Employee.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    // Get today's attendance
    const todayAttendance = await Attendance.find({
      date: { $gte: new Date(today.setHours(0,0,0,0)), $lte: new Date(today.setHours(23,59,59,999)) }
    });

    // Get monthly leaves
    const monthlyLeaves = await Leave.find({
      startDate: { $gte: startOfMonth, $lte: endOfMonth }
    });

    // Get monthly payroll
    const monthlyPayroll = await Payroll.find({
      month: today.getMonth() + 1,
      year: today.getFullYear()
    });

    const stats = {
      totalEmployees,
      departments: employeesByDepartment,
      roles: employeesByRole,
      attendance: {
        present: todayAttendance.filter(a => a.status === 'present').length,
        absent: todayAttendance.filter(a => a.status === 'absent').length,
        leave: todayAttendance.filter(a => a.status === 'leave').length
      },
      leaves: {
        total: monthlyLeaves.length,
        approved: monthlyLeaves.filter(l => l.status === 'approved').length,
        pending: monthlyLeaves.filter(l => l.status === 'pending').length,
        rejected: monthlyLeaves.filter(l => l.status === 'rejected').length
      },
      payroll: {
        total: monthlyPayroll.reduce((sum, p) => sum + p.totalAmount, 0),
        average: monthlyPayroll.length > 0 ? 
          monthlyPayroll.reduce((sum, p) => sum + p.totalAmount, 0) / monthlyPayroll.length : 0
      }
    };

    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
