const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // YYYY-MM-DD (simple day key for queries)
    day: { type: String, required: true, index: true },

    checkInAt: { type: Date },
    checkOutAt: { type: Date },

    note: { type: String, trim: true }
  },
  { timestamps: true }
);

attendanceSchema.index({ user: 1, day: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", attendanceSchema);
