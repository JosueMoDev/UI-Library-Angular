import type { Logger, Logform } from 'winston';
import winston from 'winston';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class WinstonLoggerPlugin {
  private logger: Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.printf(
          ({ timestamp, level, message, stack }: Logform.TransformableInfo) => {
            const logMessage = `${timestamp} ${level}: ${message}`;
            return stack ? `${logMessage} - ${stack}` : logMessage;
          }
        )
      ),
      transports: [new winston.transports.Console()],
    });
  }

  private log(level: LogLevel, message: string): void {
    this.logger[level](message);
  }

  info(message: string): void {
    this.log('info', message);
  }

  warn(message: string): void {
    this.log('warn', message);
  }

  error(message: string): void {
    this.log('error', message);
  }

  debug(message: string): void {
    this.log('debug', message);
  }

  logError(message: string, error: Error): void {
    this.logger.error(`${message} - ${error.stack}`);
  }
}
export function createLogger(): WinstonLoggerPlugin {
  return new WinstonLoggerPlugin();
}

const wistonLogger = createLogger();
export default wistonLogger;
