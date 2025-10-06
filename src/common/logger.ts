import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

const consoleFormat = winston.format.printf((info: any) => {
  const { level, message, timestamp } = info;

  const rawCtx = info.context ?? info.metadata?.context;
  const context =
    typeof rawCtx === 'string'
      ? rawCtx
      : typeof rawCtx === 'object' && rawCtx !== null
      ? rawCtx.context ?? 'App'
      : 'App';

  const metaObj = info.meta ?? info.metadata?.meta;
  const meta = metaObj ? ` ${JSON.stringify(metaObj)}` : '';

  return `[${timestamp}] ${level} [${context}] ${message}${meta}`;
});

export const appLogger: winston.Logger = WinstonModule.createLogger({
  transports: [
    new winston.transports.Console({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'context'] }),
        winston.format.colorize(),
        consoleFormat,
      ),
    }),

    new (winston.transports as any).DailyRotateFile({
      dirname: 'logs',
      filename: 'app-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
  ],
}) as unknown as winston.Logger;
