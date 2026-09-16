import { site } from "../config.js";

// Only offer a return link to one of this site's own pages.
const safeReferer = (value, hostname) => {
    if (typeof value !== "string" || !value) return null;
    try {
        const url = new URL(value, "https://zyte.dev");
        const hosts = new Set(["zyte.dev", "zytekaron.com", hostname]);
        if (!["https:", "http:"].includes(url.protocol) || !hosts.has(url.hostname)) return null;
        if (url.pathname === "/error") return null;
        return url.pathname + url.search + url.hash;
    } catch {
        return null;
    }
};

const renderError = (req, res, code, referer) => {
    const { heading, message } = site.global.errors[code] || site.global.errors.default;
    res.status(code).render("error", {
        code, heading, message,
        referer: safeReferer(referer, req.hostname),
    });
};

export default renderError;
