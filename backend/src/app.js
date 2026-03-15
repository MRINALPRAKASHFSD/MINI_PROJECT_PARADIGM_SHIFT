const express = require("express");
const cors = require("cors");

const apiRoutes = require("./routes");
const { errorHandler } = require("./middleware/errorHandler");

function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: "1mb" }));

  app.get("/", (req, res) => res.send("API running"));
  app.use("/api", apiRoutes);

  // 404
  app.use((req, res) => res.status(404).json({ message: "Not Found" }));

  // error handler
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
