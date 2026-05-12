import winston from "winston";

const {
  combine,
  timestamp,
  printf,
  colorize,
  errors,
} = winston.format;

const logFormat = printf(
  ({
    level,
    message,
    timestamp,
    stack,
  }) => {
    return `${timestamp} [${level}]: ${
      stack || message
    }`;
  }
);

const logger = winston.createLogger({
  level: "info",

  format: combine(
    timestamp(),
    errors({ stack: true }),
    logFormat
  ),

  transports: [
    new winston.transports.File({
      filename:
        "src/logs/error.log",

      level: "error",
    }),

    new winston.transports.File({
      filename:
        "src/logs/combined.log",
    }),
  ],

  exceptionHandlers: [
    new winston.transports.File({
      filename:
        "src/logs/exceptions.log",
    }),
  ],
});

if (
  process.env.NODE_ENV !==
  "production"
) {
  logger.add(
    new winston.transports.Console({
      format: combine(
        colorize(),
        timestamp(),
        logFormat
      ),
    })
  );
}

export default logger;