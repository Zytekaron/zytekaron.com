import { Router } from "express";
import createLogger from "../utils/createLogger.js";
import qs from "querystring"

const router = Router();

const logger = createLogger("Router/_ErrorHandler");

const redirect = (res, code, ref) => {
    let path = "/error";

    const obj = {};
    if (code) {
        obj["code"] = code;
    }
    if (ref) {
        obj["ref"] = ref;
    }
    const query = qs.stringify(obj);
    if (query.length > 0) {
        path += "?" + query;
    }
    
    res.redirect(path);
};

router.use((req, res) => {
    redirect(res, 404, req.headers.referer);
});

router.use((err, req, res) => {
    logger.error(err);
    redirect(res, 500, req.headers.referer);
});

export default router;
export { router as errorHandler, redirect as redirectError };
