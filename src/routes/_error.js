import { Router } from "express";
import createLogger from "../utils/createLogger.js";

const router = Router();

const logger = createLogger("Router/_ErrorHandler");

const redirect = (res, code, ref) => {
  res.redirect(
    `/error?code=${code}&ref=${ref ? encodeURIComponent(ref) : null}`
  );
};

router.use((req, res, next) => {
  redirect(res, 404, req.headers.referer);
});

router.use((err, req, res, next) => {
  logger.error(err);
  redirect(res, 500, req.headers.referer);
});

export default router;
export { router as errorHandler, redirect as redirectError };
