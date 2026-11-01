import { app } from "./app.js";
import { connectDB } from "./config/database.js";
import { env } from "./config/env.js";

const start = async (): Promise<void> => {
  await connectDB();

  app.listen(env.PORT, () => {
    console.log(
      `\u2713 Server listening on ${env.API_URL} (${env.NODE_ENV})`
    );
  });
};

start().catch((err) => {
  console.error("\u2717 Failed to start server:", err);
  process.exit(1);
});
