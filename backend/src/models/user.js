const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    passwordHash: { type: String, required: true },

    role: { type: String, enum: ["admin", "employee"], default: "employee" },

    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

userSchema.methods.setPassword = async function setPassword(password) {
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(password, salt);
};

userSchema.methods.validatePassword = function validatePassword(password) {
  return bcrypt.compare(password, this.password, this.passwordHash);
};

// Fix: compare with passwordHash
userSchema.methods.validatePassword = function validatePassword(password) {
  return bcrypt.compare(password, this.passwordHash);
};

module.exports = mongoose.model("User", userSchema);