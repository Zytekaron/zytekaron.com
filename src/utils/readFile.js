import fs from "fs";
import { join } from "path";
import __project_dir from "./_project_dir.js";

const readFile = (file, localToProject = true) => {
    if (!file) {
        throw "File parameter cannot be null or empty!";
    }

    const path = localToProject
        ? join(__project_dir, file)
        : file;

    if (!fs.existsSync(path)) {
        throw "File '" + path + "' is non-existent!";
    }

    return fs.readFileSync(path, "utf-8").toString();
};

export default readFile;
