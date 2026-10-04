import { Router } from "express";
import { site } from "../config.js";
import readJSON from "../utils/readJSON.js";
import { calculateAge } from "../../public/js/calculate-age.js";

const imports = readJSON("cms/_imports.json");
const router = Router();

router.use((req, res, next) => {
    const currentPath = req.path.replace(/\/+$/, "") || "/";
    res.locals.global = {
        ...site.global,
        socials: site.global.socials.filter(social => !social.hide),
    };
    res.locals.imports = imports[currentPath];
    res.locals.__path = currentPath;
    res.locals._date = new Date();
    res.locals._age = calculateAge(site.global.profile.birthDate, res.locals._date, site.global.profile.timeZone);

    const originalRender = res.render;
    res.render = function (view, options = {}, callback) {
        if (typeof options === "function") {
            callback = options;
            options = {};
        }
        const locals = typeof options === "string" ? { subView: options } : options;
        return originalRender.call(this, "layout", {
            ...locals,
            subView: locals.subView || view,
        }, callback);
    };
    next();
});

export default router;
