
const Payroll = require('../models/Payroll');
const Employee = require('../models/Employee');

// Get all payrolls
exports.getAllPayrolls = async (req, res) => {
  try {
    const payrolls = await Payroll.find().populate('employeeId', 'name email department position avatar');
    res.status(200).json({ success: true, data: payrolls });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get payrolls by period
exports.getPayrollsByPeriod = async (req, res) => {
  try {
    const { period } = req.params;
    const payrolls = await Payroll.find({ payPeriod: period }).populate('employeeId', 'name email department position avatar');
    res.status(200).json({ success: true, data: payrolls });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get a single payroll record
exports.getPayroll = async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id).populate('employeeId', 'name email department position avatar');
    if (!payroll) {
      return res.status(404).json({ success: false, error: 'Payroll record not found' });
    }
    res.status(200).json({ success: true, data: payroll });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create a new payroll record
exports.createPayroll = async (req, res) => {
  try {
    const payroll = await Payroll.create(req.body);
    res.status(201).json({ success: true, data: payroll });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Update a payroll record
exports.updatePayroll = async (req, res) => {
  try {
    const payroll = await Payroll.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!payroll) {
      return res.status(404).json({ success: false, error: 'Payroll record not found' });
    }
    res.status(200).json({ success: true, data: payroll });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get payroll summary stats
exports.getPayrollStats = async (req, res) => {
  try {
    // Get current month/year
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
    const currentYear = currentDate.getFullYear();
    const currentPeriod = `${currentMonth} ${currentYear}`;
    
    // Previous month
    const prevDate = new Date();
    prevDate.setMonth(prevDate.getMonth() - 1);
    const prevMonth = prevDate.toLocaleString('default', { month: 'long' });
    const prevYear = prevDate.getFullYear();
    const prevPeriod = `${prevMonth} ${prevYear}`;

    // Get current month payrolls
    const currentPayrolls = await Payroll.find({ payPeriod: currentPeriod });
    
    // Get previous month payrolls
    const prevPayrolls = await Payroll.find({ payPeriod: prevPeriod });

    // Calculate totals
    const totalCurrentPayroll = currentPayrolls.reduce((sum, p) => sum + p.grossPay, 0);
    const totalPrevPayroll = prevPayrolls.reduce((sum, p) => sum + p.grossPay, 0);
    
    // Calculate percentage change
    const percentChange = totalPrevPayroll > 0 
      ? ((totalCurrentPayroll - totalPrevPayroll) / totalPrevPayroll) * 100
      : 0;

    // Calculate average salary
    const totalEmployees = await Employee.countDocuments();
    const averageSalary = totalEmployees > 0 ? totalCurrentPayroll / totalEmployees : 0;

    // Get next payroll date (assume last day of next month)
    const nextPayrollDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    res.status(200).json({
      success: true,
      data: {
        totalPayroll: totalCurrentPayroll,
        percentChange,
        averageSalary,
        employeeCount: totalEmployees,
        nextPayrollDate
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
