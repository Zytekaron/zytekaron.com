import { static as serveStatic, Router } from "express";
import path from "path";
import __project_dir from "../utils/_project_dir.js";

const router = Router();

router.use(serveStatic(path.join(__project_dir, "public")));
router.use(
    "/bootstrap",
    serveStatic(path.join(__project_dir, "node_modules/bootstrap/dist"))
);
router.use(
    "/bootstrap/bootstrap-icons/font",
    serveStatic(path.join(__project_dir, "node_modules/bootstrap-icons/font"))
);
router.use(
    "/bootstrap/bootstrap-icons/icons",
    serveStatic(path.join(__project_dir, "node_modules/bootstrap-icons/icons"))
);
router.use(
    "/vanta",
    serveStatic(path.join(__project_dir, "node_modules/vanta/dist"))
);

export default router;
