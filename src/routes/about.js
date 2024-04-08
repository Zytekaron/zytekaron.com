import { Router } from "express";
import renderMarkdown from "../utils/renderMarkdown.js";

const router = Router();

router.get("/", (_, res) => {
  res.render("about", {
    data: {
      content: {
        about: renderMarkdown("about").content,
      },
    },
  });
});

// Export the router
export default router;
