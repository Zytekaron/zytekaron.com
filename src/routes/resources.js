import express from "express";
import { resources } from "../config.js";

const config = resources;

const router = express.Router();

router.get("/", (_, res) => {
  res.render("resources", config);
});

export default router;
