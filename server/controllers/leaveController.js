
const Leave = require('../models/Leave');

// Get all leave requests
exports.getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().populate('employeeId', 'name email');
    res.status(200).json({ success: true, data: leaves });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get a single leave request
exports.getLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id).populate('employeeId', 'name email');
    if (!leave) {
      return res.status(404).json({ success: false, error: 'Leave request not found' });
    }
    res.status(200).json({ success: true, data: leave });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create a new leave request
exports.createLeave = async (req, res) => {
  try {
    const leave = await Leave.create(req.body);
    res.status(201).json({ success: true, data: leave });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Update a leave request
exports.updateLeave = async (req, res) => {
  try {
    const leave = await Leave.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!leave) {
      return res.status(404).json({ success: false, error: 'Leave request not found' });
    }
    res.status(200).json({ success: true, data: leave });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Delete a leave request
exports.deleteLeave = async (req, res) => {
  try {
    const leave = await Leave.findByIdAndDelete(req.params.id);
    if (!leave) {
      return res.status(404).json({ success: false, error: 'Leave request not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


// Approve a leave request
exports.approveLeave = async (req, res) => {
  try {
    const leave = await Leave.findByIdAndUpdate(
      req.params.id, 
      { status: 'approved', updatedBy: req.user._id },
      { new: true, runValidators: true }
    );
    
    if (!leave) {
      return res.status(404).json({ success: false, error: 'Leave request not found' });
    }
    
    res.status(200).json({ success: true, data: leave });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Reject a leave request
exports.rejectLeave = async (req, res) => {
  try {
    const leave = await Leave.findByIdAndUpdate(
      req.params.id, 
      { 
        status: 'rejected', 
        updatedBy: req.user._id,
        rejectionReason: req.body.rejectionReason 
      },
      { new: true, runValidators: true }
    );
    
    if (!leave) {
      return res.status(404).json({ success: false, error: 'Leave request not found' });
    }
    
    res.status(200).json({ success: true, data: leave });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
