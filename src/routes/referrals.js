import { Router } from "express";
import { referrals as rawReferrals } from "../config.js";

const referrals = rawReferrals
    .filter(r => !r.hide);

const router = Router();

router.get("/", (_, res) => {
    res.render("referrals", {
        referrals,
    });
});

export default router;
