const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tenant',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    checkIn: {
      type: Date,
      default: null,
    },
    checkOut: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['present', 'absent', 'leave'],
      default: 'absent',
    },
    location: {
      type: {
        type: String,
        enum: ['office', 'remote', 'field'],
        default: 'office'
      },
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    },
    notes: {
      type: String
    }
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate entries
attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
