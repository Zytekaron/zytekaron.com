import { Router } from "express";
import renderMarkdown from "../utils/renderMarkdown.js";

const { content } = renderMarkdown("about");

const router = Router();

router.get("/", (_, res) => {
    res.render("about", {
        content,
    });
});

export default router;
