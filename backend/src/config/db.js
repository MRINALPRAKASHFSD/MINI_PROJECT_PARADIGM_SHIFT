const mongoose = require("mongoose");

async function connectDb(mongoUri) {
  mongoose.set("strictQuery", true);

  await mongoose.connect(mongoUri);

  return mongoose.connection;
}

module.exports = { connectDb };
