import { Router } from "express";
import renderMarkdown from "../utils/renderMarkdown.js";
import { projects as rawProjects } from "../config.js";

const { content } = renderMarkdown("home-intro");
const projects = rawProjects
    .filter(p => !p.hide && p.pinned);

const router = Router();

router.get("/", (_, res) => {
    res.render("index", {
        content,
        projects,
    });
});

export default router;
