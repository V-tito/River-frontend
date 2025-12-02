import pino from 'pino';

const logger = pino({
  level: 'info', // Set the default logging level
  transport: {
    target: 'pino-pretty', // Optional, for pretty output during development
    options: {
      colorize: true, // Enable colorizing in log output
    },
  },
});

export default logger;