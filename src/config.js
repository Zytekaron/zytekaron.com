import readJSON from "./utils/readJSON.js";

const site = readJSON("cms/site.config.json");
const referrals = readJSON("cms/referrals.config.json");
const projects = readJSON("cms/projects.config.json");

export { site, referrals, projects };
