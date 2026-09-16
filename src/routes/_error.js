import { Router } from "express";
import createLogger from "../utils/createLogger.js";
import renderError from "../utils/renderError.js";

const router = Router();
const logger = createLogger("Router/_ErrorHandler");

router.use((req, res) => renderError(req, res, 404, req.headers.referer));
router.use((err, req, res, next) => {
    logger.error(err);
    if (res.headersSent) return next(err);
    return renderError(req, res, 500, req.headers.referer);
});

export default router;
