import readJSON from "./utils/readJSON.js";

const site = readJSON("cms/site.config.json");
const resources = readJSON("cms/resources.config.json");
const projects = readJSON("cms/projects.config.json");

export { site, resources, projects };
