export type LogLevel = 'error' | 'warn' | 'info' | 'http' | 'verbose' | 'debug' | 'silly';

export interface LoggerConfig {
    level?: LogLevel; // default: "info"
    console?: boolean; // default: true
    file?: boolean; // default: false
    dir?: string; // default: "logs"
    json?: boolean; // default: true (use text/printf if false)
    serviceName?: string; // default: "bna-service"
    silent?: boolean; // default: false (useful for tests)
}

export interface Config {
    mongoUri: string;
    logger?: LoggerConfig;
}

let cfg: Config | undefined;

export const setConfig = (c: Config): void => {
    cfg = c;
};

export const getConfig = (): Config => {
    if (!cfg) throw new Error('Config not set. Call setConfig() first.');
    return cfg;
};
