const { createApp } = require("./app");
const { loadEnv } = require("./config/env");
const { connectDb } = require("./config/db");

async function main() {
  const env = loadEnv();
  await connectDb(env.mongoUri);

  const app = createApp();
  app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server listening on port ${env.port}`);
  });
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
