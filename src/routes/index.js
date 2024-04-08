import { Router } from "express";
import renderMarkdown from "../utils/renderMarkdown.js";
import { projects as projectsConfig } from "../config.js";

const router = Router();

router.get("/", (_, res) => {
  res.render("index", {
    data: {
      content: {
        intro: renderMarkdown("home-intro").content,
        projects: projectsConfig.filter((p) => p.pinned),
      },
    },
  });
});

export default router;
