import { Router } from "express";
import __project_dir from "../utils/_project_dir.js";
import renderMarkdown from "../utils/renderMarkdown.js";
import { projects as rawProjects } from "../config.js";

const { content } = renderMarkdown("projects");
const projects = rawProjects
    .filter(p => !p.hide)
    // Sort the pinned projects to be at first
    .sort((a, b) => {
        if (a.pinned && !b.pinned) {
            return -1;
        }
        if (b.pinned && !a.pinned) {
            return 1;
        }
        return a.title.localeCompare(b.title);
    })
    // Defaults; Required as it throws error if the property is missing
    .map(p => {
        if (!p.pinned) {
            p.pinned = false;
        }
        return p;
    });

const router = Router();

router.get("/", (_, res) =>
    res.render("projects", {
        content,
        projects,
    })
);

export default router;
