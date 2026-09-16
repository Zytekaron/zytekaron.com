import { Router } from "express";
import renderError from "../utils/renderError.js";

const router = Router();
router.get("/", (req, res) => {
    const rawCode = req.query.code;
    const code = typeof rawCode === "string" && /^\d{3}$/.test(rawCode) ? Number(rawCode) : 400;
    return renderError(req, res, code >= 400 && code <= 511 ? code : 400, req.query.ref);
});

export default router;
