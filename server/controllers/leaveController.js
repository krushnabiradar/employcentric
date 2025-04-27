
const Leave = require('../models/Leave');
const logger = require('../utils/logger');

// Get all leaves (filtered by user role)
const getAllLeaves = async (req, res) => {
  try {
    let leaves;
    
    if (req.user.role === 'employee') {
      // Employees can only see their own leaves
      leaves = await Leave.find({ userId: req.user._id });
    } else {
      // HR and Admin can see all leaves
      leaves = await Leave.find();
    }
    
    res.json(leaves);
  } catch (error) {
    logger.error(`Get leaves error: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new leave request
const createLeave = async (req, res) => {
  try {
    const { startDate, endDate, leaveType, reason } = req.body;
    
    const newLeave = new Leave({
      userId: req.user._id,
      userName: req.user.name,
      startDate,
      endDate,
      leaveType,
      reason
    });
    
    const leave = await newLeave.save();
    
    // Emit socket event for notifications
    const io = req.app.get('io');
    io.to('admin').to('hr').emit('new-leave-request', {
      message: `New leave request from ${req.user.name}`,
      leave
    });
    
    res.status(201).json(leave);
  } catch (error) {
    logger.error(`Create leave error: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// Approve leave request
const approveLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    
    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }
    
    leave.status = 'approved';
    leave.approvedBy = req.user.name;
    leave.updatedAt = Date.now();
    
    await leave.save();
    
    // Emit socket event for notifications
    const io = req.app.get('io');
    io.to(leave.userId.toString()).emit('leave-status-update', {
      message: 'Your leave request has been approved',
      leave
    });
    
    res.json(leave);
  } catch (error) {
    logger.error(`Approve leave error: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// Reject leave request
const rejectLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    
    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }
    
    leave.status = 'rejected';
    leave.rejectedBy = req.user.name;
    leave.rejectionReason = req.body.reason;
    leave.updatedAt = Date.now();
    
    await leave.save();
    
    // Emit socket event for notifications
    const io = req.app.get('io');
    io.to(leave.userId.toString()).emit('leave-status-update', {
      message: 'Your leave request has been rejected',
      leave
    });
    
    res.json(leave);
  } catch (error) {
    logger.error(`Reject leave error: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllLeaves,
  createLeave,
  approveLeave,
  rejectLeave
};
