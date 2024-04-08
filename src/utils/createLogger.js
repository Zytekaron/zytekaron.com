import log4js from "log4js";
import { site as siteConfig } from "../config.js";

log4js.configure(siteConfig.private.log4js);

const createLogger = (name) => {
  const logger = log4js.getLogger(name);
  logger.level = process.env.DEBUG === "true" ? "debug" : "info";

  return logger;
};

export default createLogger;
