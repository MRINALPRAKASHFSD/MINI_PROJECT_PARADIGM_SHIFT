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
