import __project_dir from "./_project_dir.js";
import readFile from "./readFile.js";

const readJSON = (file, localToProject = true) => {
    return JSON.parse(readFile(file, localToProject));
};

export default readJSON;
