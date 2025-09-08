import winston from 'winston';
import fs from 'node:fs';
import path from 'node:path';
import { getConfig } from './config';

let logger: winston.Logger | undefined;

export const initLogger = (): void => {
    const { logger: lc = {} } = getConfig();

    const level = lc.level ?? 'info';
    const consoleEnabled = lc.console ?? true;
    const fileEnabled = lc.file ?? false;
    const dir = lc.dir ?? 'logs';
    const json = lc.json ?? true;
    const serviceName = lc.serviceName ?? 'bna-service';
    const silent = lc.silent ?? false;

    const formats: winston.Logform.Format[] = [
        winston.format.label({ label: serviceName }),
        winston.format.timestamp(),
        json
            ? winston.format.json()
            : winston.format.printf(({ timestamp, level, message, label, ...meta }) => {
                  const rest = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
                  return `${timestamp} [${label}] ${level}: ${message}${rest}`;
              }),
    ];

    const transports: winston.transport[] = [];

    if (consoleEnabled) {
        transports.push(new winston.transports.Console());
    }

    if (fileEnabled) {
        fs.mkdirSync(dir, { recursive: true });
        transports.push(
            new winston.transports.File({ filename: path.join(dir, 'error.log'), level: 'error' }),
        );
        transports.push(new winston.transports.File({ filename: path.join(dir, 'combined.log') }));
    }

    logger = winston.createLogger({
        level,
        silent,
        format: winston.format.combine(...formats),
        defaultMeta: { service: serviceName },
        transports,
    });
};

export const getLogger = (): winston.Logger => {
    if (!logger) throw new Error('Logger not initialized. Call initLogger() first.');
    return logger;
};

export const getModuleLogger = (scope: string): winston.Logger => {
    return getLogger().child({ scope });
};
