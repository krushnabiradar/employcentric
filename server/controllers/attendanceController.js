
const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');
const { startOfDay, endOfDay, startOfMonth, endOfMonth } = require('date-fns');

// Get today's attendance for all employees
exports.getTodayAttendance = async (req, res) => {
  try {
    const today = new Date();
    const startOfToday = startOfDay(today);
    const endOfToday = endOfDay(today);

    const attendances = await Attendance.find({
      date: { $gte: startOfToday, $lte: endOfToday }
    }).populate('employeeId', 'name email avatar');

    res.status(200).json({ success: true, data: attendances });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get monthly attendance for a specific employee
exports.getMonthlyAttendance = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const date = req.query.date ? new Date(req.query.date) : new Date();
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);

    const attendances = await Attendance.find({
      employeeId,
      date: { $gte: monthStart, $lte: monthEnd }
    }).sort('date');

    res.status(200).json({ success: true, data: attendances });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Check in an employee
exports.checkIn = async (req, res) => {
  try {
    const { employeeId } = req.body;
    const today = new Date();
    const startOfToday = startOfDay(today);
    
    // Find or create today's attendance record
    let attendance = await Attendance.findOne({
      employeeId,
      date: { $gte: startOfToday, $lte: endOfDay(today) }
    });

    if (!attendance) {
      attendance = new Attendance({
        employeeId,
        date: today,
        status: 'present'
      });
    }

    // Only check in if not already checked in
    if (!attendance.checkIn) {
      attendance.checkIn = today;
      attendance.status = 'present';
      await attendance.save();
      return res.status(200).json({ success: true, data: attendance });
    } else {
      return res.status(400).json({ success: false, error: 'Already checked in today' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Check out an employee
exports.checkOut = async (req, res) => {
  try {
    const { employeeId } = req.body;
    const today = new Date();
    
    // Find today's attendance record
    const attendance = await Attendance.findOne({
      employeeId,
      date: { $gte: startOfDay(today), $lte: endOfDay(today) }
    });

    if (!attendance) {
      return res.status(404).json({ success: false, error: 'No check-in record found for today' });
    }

    // Only check out if already checked in
    if (attendance.checkIn && !attendance.checkOut) {
      attendance.checkOut = today;
      await attendance.save();
      return res.status(200).json({ success: true, data: attendance });
    } else if (attendance.checkOut) {
      return res.status(400).json({ success: false, error: 'Already checked out today' });
    } else {
      return res.status(400).json({ success: false, error: 'Must check in before checking out' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get attendance stats
exports.getAttendanceStats = async (req, res) => {
  try {
    const date = req.query.date ? new Date(req.query.date) : new Date();
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);

    // Get all employees count
    const totalEmployees = await Employee.countDocuments();
    
    // Get today's attendance
    const today = new Date();
    const todayAttendance = await Attendance.find({
      date: { $gte: startOfDay(today), $lte: endOfDay(today) },
      status: 'present'
    });

    // Get monthly stats
    const monthlyAttendance = await Attendance.find({
      date: { $gte: monthStart, $lte: monthEnd }
    });

    const present = monthlyAttendance.filter(a => a.status === 'present').length;
    const absent = monthlyAttendance.filter(a => a.status === 'absent').length;
    const leave = monthlyAttendance.filter(a => a.status === 'leave').length;

    res.status(200).json({
      success: true,
      data: {
        totalEmployees,
        todayPresent: todayAttendance.length,
        todayAbsent: totalEmployees - todayAttendance.length,
        monthlyStats: {
          present,
          absent,
          leave
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
