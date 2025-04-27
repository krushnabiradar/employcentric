const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema(
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
    payPeriod: {
      type: String,
      required: true,
    },
    payDate: {
      type: Date,
      required: true,
    },
    grossPay: {
      type: Number,
      required: true,
    },
    deductions: {
      type: Number,
      required: true,
    },
    netPay: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['paid', 'processing', 'pending'],
      default: 'pending',
    },
    currency: {
      type: String,
      default: 'USD'
    },
    paymentMethod: {
      type: String,
      enum: ['bank_transfer', 'check', 'cash'],
      default: 'bank_transfer'
    },
    details: {
      basicSalary: {
        type: Number,
        required: true,
      },
      overtime: {
        type: Number,
        default: 0,
      },
      bonus: {
        type: Number,
        default: 0,
      },
      incomeTax: {
        type: Number,
        required: true,
      },
      socialSecurity: {
        type: Number,
        default: 0,
      },
      healthInsurance: {
        type: Number,
        default: 0,
      },
      workingDays: {
        type: Number,
        default: 0,
      },
      overtimeHours: {
        type: Number,
        default: 0,
      },
    },
    bankAccount: {
      type: String,
      required: true,
    },
    bankName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Payroll', payrollSchema);
