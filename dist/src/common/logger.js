"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appLogger = void 0;
const nest_winston_1 = require("nest-winston");
const winston = require("winston");
require("winston-daily-rotate-file");
const consoleFormat = winston.format.printf((info) => {
    const { level, message, timestamp } = info;
    const rawCtx = info.context ?? info.metadata?.context;
    const context = typeof rawCtx === 'string'
        ? rawCtx
        : typeof rawCtx === 'object' && rawCtx !== null
            ? rawCtx.context ?? 'App'
            : 'App';
    const metaObj = info.meta ?? info.metadata?.meta;
    const meta = metaObj ? ` ${JSON.stringify(metaObj)}` : '';
    return `[${timestamp}] ${level} [${context}] ${message}${meta}`;
});
exports.appLogger = nest_winston_1.WinstonModule.createLogger({
    transports: [
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(winston.format.timestamp(), winston.format.errors({ stack: true }), winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'context'] }), winston.format.colorize(), consoleFormat),
        }),
        new winston.transports.DailyRotateFile({
            dirname: 'logs',
            filename: 'app-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            level: 'info',
            format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
        }),
    ],
});
//# sourceMappingURL=logger.js.map