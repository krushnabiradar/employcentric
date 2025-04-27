
const mongoose = require('mongoose');

const TenantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: false
  },
  address: {
    type: String,
    required: false
  },
  industry: {
    type: String,
    required: false
  },
  plan: {
    type: String,
    enum: ['Basic', 'Professional', 'Enterprise'],
    default: 'Basic'
  },
  status: {
    type: String,
    enum: ['Active', 'Suspended', 'Pending'],
    default: 'Pending'
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  customization: {
    logo: String,
    primaryColor: String,
    secondaryColor: String
  },
  settings: {
    mfaRequired: {
      type: Boolean,
      default: false
    },
    passwordRotation: {
      type: Number,
      default: 90
    },
    sessionTimeout: {
      type: Number,
      default: 60
    },
    allowedIpRanges: String
  },
  features: {
    enableRecruiting: {
      type: Boolean,
      default: true
    },
    enablePayroll: {
      type: Boolean,
      default: true
    },
    enableAttendance: {
      type: Boolean,
      default: true
    },
    enableLeave: {
      type: Boolean,
      default: true
    },
    enablePerformance: {
      type: Boolean,
      default: false
    },
    enableTraining: {
      type: Boolean,
      default: false
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  lastBillingDate: {
    type: Date
  },
  nextBillingDate: {
    type: Date
  },
  paymentStatus: {
    type: String,
    enum: ['Paid', 'Pending', 'Failed'],
    default: 'Pending'
  }
});

// Update the updatedAt timestamp before saving
TenantSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Tenant', TenantSchema);
