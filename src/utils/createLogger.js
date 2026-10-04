import log4js from "log4js";
import { site as siteConfig } from "../config.js";

log4js.configure(process.env.LOG_OUTPUT === "console" ? {
    appenders: { console: { type: "console" } },
    categories: { default: { appenders: ["console"], level: "info" } },
} : siteConfig.private.log4js);

const createLogger = (name) => {
    const logger = log4js.getLogger(name);
    logger.level = process.env.DEBUG === "true" ? "debug" : "info";

    return logger;
};

export default createLogger;
