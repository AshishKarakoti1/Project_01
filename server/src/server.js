import "dotenv/config";

import app from "./app.js";

import connectDB from "./config/db.js";

import logger from "./utils/logger.js";

const PORT = process.env.PORT || 5000;

process.on(
  "unhandledRejection",
  (err) => {
    logger.error(
      `UNHANDLED REJECTION: ${err}`
    );

    process.exit(1);
  }
);

process.on(
  "uncaughtException",
  (err) => {
    logger.error(
      `UNCAUGHT EXCEPTION: ${err}`
    );

    process.exit(1);
  }
);

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      logger.info(
        `Server running on port ${PORT}`
      );
    });
  } catch (error) {
    logger.error(
      `STARTUP ERROR: ${error}`
    );

    process.exit(1);
  }
};

startServer();