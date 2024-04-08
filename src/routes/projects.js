import express from "express";
import __project_dir from "../utils/_project_dir.js";
import renderMarkdown from "../utils/renderMarkdown.js";
import { projects } from "../config.js";

const config = projects
  //  Sort the pinned projects to be at first
  .sort((a, b) => {
    if (a.pinned === b.pinned) {
      return a.title.localeCompare(b.title);
    }

    if (a.pinned && !b.pinned) {
      return -1;
    }

    return 1;
  })
  // Defaults; Required as it throws error if the property is missing
  .map((p) => {
    if (!Object.keys(p).includes("pinned")) p.pinned = false;
    return p;
  });

const router = express.Router();

router.get("/", (_, res) =>
  res.render("projects", {
    content: renderMarkdown("projects").content,
    projects: config,
  })
);

export default router;
