const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6, select: false },
  role: { type: String, enum: ['employee', 'admin', 'hr'], default: 'employee' },
  employeeId: { type: String, unique: true },
  phone: { type: String, default: '' },
  department: { type: String, default: '' },
  designation: { type: String, default: '' },
  joiningDate: { type: Date },
  salary: { type: Number, default: 0 },
  status: { type: String, enum: ['Active', 'Inactive', 'On Leave'], default: 'Active' },
  avatar: { type: String, default: '' },
  profileComplete: { type: Boolean, default: false },
  companyName: { type: String, default: '' },
  
  // Extended Profile
  gender: { type: String, default: '' },
  dateOfBirth: { type: Date },
  address: { type: String, default: '' },
  city: { type: String, default: '' },
  state: { type: String, default: '' },
  pincode: { type: String, default: '' },
  country: { type: String, default: '' },

  // Employment specifics
  employmentType: { type: String, default: 'Full-time' },
  reportingManager: { type: String, default: '' },
  workLocation: { type: String, default: '' },

  // Bank Details
  bankDetails: {
    accountNumber: { type: String, default: '' },
    ifscCode: { type: String, default: '' },
    bankName: { type: String, default: '' },
    branch: { type: String, default: '' },
    accountHolderName: { type: String, default: '' },
    accountType: { type: String, default: 'Savings' }
  },

  // Emergency Contact
  emergencyContact: {
    name: { type: String, default: '' },
    relationship: { type: String, default: '' },
    phone: { type: String, default: '' },
    address: { type: String, default: '' }
  },

  // Notifications
  notifications: {
    emailNotifications: { type: Boolean, default: true },
    pushNotifications: { type: Boolean, default: true },
    taskReminders: { type: Boolean, default: true },
    weeklyReports: { type: Boolean, default: false },
    projectUpdates: { type: Boolean, default: true }
  },
  
  // Leave Balances
  leaveBalances: {
    casual: { type: Number, default: 12 },
    earned: { type: Number, default: 15 },
    sick: { type: Number, default: 10 },
    total: { type: Number, default: 37 }
  }
}, { timestamps: true });

userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
