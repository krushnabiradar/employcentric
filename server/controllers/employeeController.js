
const Employee = require('../models/Employee');
const User = require('../models/User');

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
