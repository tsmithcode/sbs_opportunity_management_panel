type LogLevel = "debug" | "info" | "warn" | "error";
type LogData = Record<string, unknown>;

function log(level: LogLevel, message: string, data?: LogData) {
  if (import.meta.env.PROD) {
    // Structured JSON in production — parseable by log aggregators
    console[level](JSON.stringify({ level, message, ts: new Date().toISOString(), ...data }));
  } else {
    const prefix = `[monyawn:${level}]`;
    if (data) {
      console[level](prefix, message, data);
    } else {
      console[level](prefix, message);
    }
  }
}

export const logger = {
  debug: (msg: string, data?: LogData) => log("debug", msg, data),
  info: (msg: string, data?: LogData) => log("info", msg, data),
  warn: (msg: string, data?: LogData) => log("warn", msg, data),
  error: (msg: string, data?: LogData) => log("error", msg, data),
};
