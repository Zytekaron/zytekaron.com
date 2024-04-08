import fs from "fs";
import { join } from "path";
import __project_dir from "./_project_dir.js";

const readFile = (file, localToProject = true) => {
  if (!file || file === "") {
    throw "File parameter cannot be null or empty!";
  }

  let path;

  if (localToProject) {
    path = join(__project_dir, file);
  } else {
    path = file;
  }

  if (!fs.existsSync(path)) {
    throw "File '" + path + "' is non-existent!";
  }

  const content = fs.readFileSync(path, "utf-8");

  return content;
};

export default readFile;
