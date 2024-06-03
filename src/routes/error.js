import { Router } from "express";
import { site as siteConfig } from "../config.js";
import { redirectError } from "./_error.js";

const router = Router();
router.get("/", (req, res) => {
    const { code, ref } = req.query;

    if (!code || isNaN(code) || code < 400 || code > 511) {
        return redirectError(res, 400, ref);
    }

    const { heading, message } =
        siteConfig.global.errors[code] || siteConfig.global.errors.default;

    res.render("error", {
        code,
        referer,
        heading,
        message,
    });
});

export default router;
