import dotenv from "dotenv";
dotenv.config();

import { readdirSync, statSync } from "fs";
import path from "path";
import express from "express";
import { pathToFileURL } from "url";
import __project_dir from "./utils/_project_dir.js";
import renderHandler from "./routes/_render.js";
import staticHandler from "./routes/_static.js";
import errorHandler from "./routes/_error.js";
import createLogger from "./utils/createLogger.js";

const logger = createLogger("Server");
logger.info("Starting server...");

const app = express();

// Server config
app.set("views", path.join(__project_dir, "views"));
app.set("view engine", "ejs");

// Middleware

app.use(staticHandler);
app.use(renderHandler);

const loadRouters = async (dir, prefix = "") => {
  const files = readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stats = statSync(filePath);

    if (stats.isDirectory()) {
      const subPrefix = path.join(prefix, file);
      await loadRouters(filePath, subPrefix);
    } else if (path.extname(file) === ".js") {
      const name = path.basename(file, ".js");

      if (name.startsWith("_")) {
        continue;
      }

      const route =
        name === "index" ? `/${prefix}` || "/" : `${prefix}/${name}`;
      const fileURL = pathToFileURL(filePath).href;
      const router = await import(fileURL);

      app.use(route, router.default);
      logger.info("Registering router: %s -> %s", filePath, route);
    }
  }
};

await loadRouters(path.join(__project_dir, "src/routes"));
app.use(errorHandler);

const shutdown = (server) => {
  logger.debug("Received kill signal, shutting down gracefully");
  server.close(() => {
    logger.debug("Closed out remaining connections");
    process.exit(0);
  });

  setTimeout(() => {
    logger.error(
      "Could not close connections in time, forcefully shutting down"
    );
    process.exit(1);
  }, 10000);
};

const server = app.listen(process.env.PORT, process.env.HOSTNAME, () => {
  logger.info(
    "Listening on http://%s:%d",
    process.env.HOSTNAME,
    process.env.PORT
  );
});

process.on("SIGTERM", () => shutdown(server));
process.on("SIGINT", () => shutdown(server));
